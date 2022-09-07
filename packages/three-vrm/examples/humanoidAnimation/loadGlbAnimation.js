/* global THREE, mixamoVRMRigMap */

/**
 * Load Mixamo animation, convert for three-vrm use, and return it.
 *
 * @param {string} url A url of mixamo animation data
 * @param {VRM} vrm A target VRM
 * @returns {Promise<THREE.AnimationClip>} The converted AnimationClip
 */
function loadGLBAnimation( url, vrm ) {
	const gltfLoader = new THREE.GLTFLoader();
	return gltfLoader.loadAsync(
		'../animations/animArmOnly777.glb').then(
		(asset) => {
			const clip = (asset).animations[0];
			console.log(asset)
			const tracks = [];

			const restRotationInverse = new THREE.Quaternion();
			const parentRestWorldRotation = new THREE.Quaternion();
			const _quatA = new THREE.Quaternion();

			clip.tracks.forEach( ( track ) => {

				// Convert each tracks for VRM use, and push to `tracks`
				const trackSplitted = track.name.split( '.' );
				const mixamoRigName = trackSplitted[ 0 ];
				const vrmBoneName = customVRMRigMap[ mixamoRigName ];
				const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode( vrmBoneName )?.name;
				// console.log(trackSplitted, vrmBoneName)
				const mixamoRigNode = asset.scene.getObjectByName( mixamoRigName );

				if ( vrmNodeName != null ) {

					const propertyName = trackSplitted[ 1 ];

					// Store rotations of rest-pose.
					mixamoRigNode.getWorldQuaternion( restRotationInverse ).invert();
					mixamoRigNode.parent.getWorldQuaternion( parentRestWorldRotation );


					if ( track instanceof THREE.QuaternionKeyframeTrack ) {

						// Retarget rotation of mixamoRig to NormalizedBone.
						for ( let i = 0; i < track.values.length; i += 4 ) {

							const flatQuaternion = track.values.slice( i, i + 4 );

							_quatA.fromArray( flatQuaternion );

							// 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
							_quatA
								.premultiply( parentRestWorldRotation )
								.multiply( restRotationInverse );

							_quatA.toArray( flatQuaternion );

							flatQuaternion.forEach( ( v, index ) => {

								track.values[ index + i ] = v;

							} );

						}

						tracks.push(
							new THREE.QuaternionKeyframeTrack(
								`${vrmNodeName}.${propertyName}`,
								track.times,
								track.values,
							),
						);

					} else if ( track instanceof THREE.VectorKeyframeTrack ) {

						let nodeName = vrmNodeName;
						let value = track.values.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? - v : v ) * 0.01 );
						console.log(track.values)
						tracks.push( new THREE.VectorKeyframeTrack( `${nodeName}.${propertyName}`, track.times, track.values ) );

					}

				}

			} );

			return new THREE.AnimationClip( 'vrmAnimation', clip.duration, tracks );


		});
}
