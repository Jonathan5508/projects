import { useState } from "react"
import { useBox } from "@react-three/cannon"
import * as textures from '../images/textures'
import { useStore } from "../hooks/useStore"

export const Cube = ({ position, texture }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [ref] = useBox(() => ({
        type: 'Static',
        position
    }))
    const [addCube, removeCube] = useStore((state) => [state.addCube, state.removeCube])

    const activeTexture = textures[texture+"Texture"]

    return (
        <mesh 
        onPointerMove={(e) => {
            e.stopPropagation()
            setIsHovered(true)
        }}
        onPointerOut={(e) => {
            e.stopPropagation()
            setIsHovered(false)
        }}
        onClick={(e) => {
            e.stopPropagation()
            const clickFace = Math.floor(e.faceIndex / 2)
            const {x, y, z} = ref.current.position
            if(e.altKey) {
                removeCube(x, y, z)
                return
            }
            else if(clickFace == 0) {
                addCube(x + 1, y, z)
                return
            }
            else if(clickFace == 1) {
                addCube(x - 1, y, z)
                return
            }
            else if(clickFace == 2) {
                addCube(x, y + 1, z)
                return
            }
            else if(clickFace == 3) {
                addCube(x, y - 1, z)
                return
            }
            else if(clickFace == 4) {
                addCube(x, y, z + 1)
                return
            }
            else if(clickFace == 5) {
                addCube(x - 1, y, z - 1)
                return
            }
        }} ref={ref}>
            <boxBufferGeometry attach="geometry"/>
            <meshStandardMaterial color={isHovered ? 'gray' : 'white'} map={activeTexture} transparent={true} opacity={texture === 'glass' ? 0.6 : 1} attach="material"/>

        </mesh>
    )
}