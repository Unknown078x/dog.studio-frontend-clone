import React, { act, useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { Camera } from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


const Dog = () => {

    gsap.registerPlugin(useGSAP)
    gsap.registerPlugin(ScrollTrigger)


const BASE = import.meta.env.BASE_URL;

const [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
    mat6,
    mat7,
    mat8,
    mat9,
    mat10,
    mat11,
    mat12,
    mat13,
    mat14,
    mat15,
    mat16,
    mat17,
    mat18,
    mat19,
    mat20
] = useTexture([
    `${BASE}matcap/mat-1.png`,
    `${BASE}matcap/mat-2.png`,
    `${BASE}matcap/mat-3.png`,
    `${BASE}matcap/mat-4.png`,
    `${BASE}matcap/mat-5.png`,
    `${BASE}matcap/mat-6.png`,
    `${BASE}matcap/mat-7.png`,
    `${BASE}matcap/mat-8.png`,
    `${BASE}matcap/mat-9.png`,
    `${BASE}matcap/mat-10.png`,
    `${BASE}matcap/mat-11.png`,
    `${BASE}matcap/mat-12.png`,
    `${BASE}matcap/mat-13.png`,
    `${BASE}matcap/mat-14.png`,
    `${BASE}matcap/mat-15.png`,
    `${BASE}matcap/mat-16.png`,
    `${BASE}matcap/mat-17.png`,
    `${BASE}matcap/mat-18.png`,
    `${BASE}matcap/mat-19.png`,
    `${BASE}matcap/mat-20.png`,
]).map(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
});





    const model = useGLTF(`${BASE}models/dog.drc.glb`);

    useThree(({ camera, scene, gl }) => {
        camera.position.z = 0.5
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })

    const { actions } = useAnimations(model.animations, model.scene)

    useEffect(() => {
        actions["Take 001"].play()
    }, [actions])

    const material = useRef({
        uMatcap1: { value: mat19 },
        uMatcap2: { value: mat2 },
        uProgress: { value: 1.0 }
    })

    const [normalMap, sampleMatCap] = (useTexture([`${BASE}models/dog_normals.jpg`,])).map(texture => {
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    })

  const [branchMap, branchNormalMap] = useTexture([
    `${BASE}models/branches_diffuse.jpeg`,
    `${BASE}models/branches_normals.jpeg`
]).map(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
});

    const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: mat2
    })

    const branchMaterial = new THREE.MeshMatcapMaterial({
        normalMap: branchNormalMap,
        map: branchMap
    })





    function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    dogMaterial.onBeforeCompile = onBeforeCompile

    model.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.material = dogMaterial
        } else {
            child.material = branchMaterial
        }
    })





    model.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.material = dogMaterial
        } else {
            child.material = branchMaterial
        }
    })

    const dogModel = useRef(model)

    useGSAP(() => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section1",
                endTrigger: "#section4",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        })

        tl.to(dogModel.current.scene.position, {
            z: "-=0.6",
            y: "+=0.1"
        }).to(dogModel.current.scene.rotation, {
            x: `+=${Math.PI / 16}`
        }).to(dogModel.current.scene.rotation, {
            y: `-=${Math.PI}`
        }, "a").to(dogModel.current.scene.position, {
            x: "-=0.57",
            z: "+=0.50",
            y: "-=0.05"
        }, "a")

    }, [])

    useEffect(() => {
        document.querySelector(`.head[img-title="oneBg"]`).addEventListener("mouseenter", () => {
            material.current.uMatcap1.value = mat19
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="twoBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="threeBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat9

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="fourBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat12

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="fiveBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat10

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="sixBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.head[img-title="sevenBg"]`).addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat13

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        document.querySelector(`.wrapper`).addEventListener("mouseleave", () => {

            material.current.uMatcap1.value = mat2

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })

    }, [])


    return (

        <>

            <primitive object={model.scene} position={[0.25, -.55, 0]} rotation={[0, Math.PI / 4, 0]} />
            <directionalLight position={[0, 5, 5]} color={0xFFFFFF} intensity={10} />

        </>
    )
}

export default Dog
