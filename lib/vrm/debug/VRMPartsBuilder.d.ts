import * as THREE from 'three';
import { VRMBlendShapeProxy } from '../blendshape';
import { VRMFirstPerson } from '../firstperson';
import { VRMHumanBones } from '../humanoid';
import { VRMLookAtHead } from '../lookat';
import { VRMSpringBoneManager } from '../springbone';
import * as Raw from '../types/VRM';
import { VRMPartsBuilder } from '../VRMPartsBuilder';
import { DebugOption } from './DebugOption';
export declare class VRMPartsBuilderDebugProxy extends VRMPartsBuilder {
    private readonly target;
    private readonly debugOption?;
    constructor(target: VRMPartsBuilder, debugOption?: DebugOption);
    loadHumanoid(gltf: THREE.GLTF): Promise<VRMHumanBones | null>;
    loadFirstPerson(firstPerson: Raw.RawVrmFirstPerson, humanBones: VRMHumanBones, gltf: THREE.GLTF): Promise<VRMFirstPerson | null>;
    loadLookAt(firstPerson: Raw.RawVrmFirstPerson, blendShapeProxy: VRMBlendShapeProxy, humanBodyBones: VRMHumanBones): VRMLookAtHead;
    loadBlendShapeMaster(animationMixer: THREE.AnimationMixer, gltf: THREE.GLTF): Promise<VRMBlendShapeProxy | null>;
    loadSecondary(gltf: THREE.GLTF): Promise<VRMSpringBoneManager>;
}
