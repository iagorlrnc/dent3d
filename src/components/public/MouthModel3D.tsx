import React, { useRef, useState, useMemo, Component, ReactNode } from 'react'
// @ts-ignore
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Html, useProgress, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
// @ts-ignore
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Definição de tipos estritos para o resultado do useGLTF
interface GLTFResult {
  nodes: {
    lowerBase: THREE.Mesh
    upperBase: THREE.Mesh
    lowerTeeth: THREE.Mesh
    upperTeeth: THREE.Mesh
  }
}

interface MouthPresenterProps {
  geometries: {
    lowerBase: THREE.BufferGeometry
    upperBase: THREE.BufferGeometry
    lowerTeeth: THREE.BufferGeometry
    upperTeeth: THREE.BufferGeometry
  }
}

// Materiais instanciados estaticamente para evitar overhead de hooks e re-alocações
const gumMaterial = new THREE.MeshStandardMaterial({
  color: '#e28f95', // Rosa de gengiva realista
  roughness: 0.25,
  metalness: 0.1,
})

const teethMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff', // Branco limpo e polido
  roughness: 0.15,
  metalness: 0.05,
})

// Componente ErrorBoundary para capturar erros de carregamento do GLB e alternar para STL
interface ErrorBoundaryProps {
  fallback: ReactNode
  onError?: (error: Error) => void
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Componente de carregamento para mostrar o progresso do download
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-dark/90 p-6 rounded-lg border border-gold/20 shadow-2xl backdrop-blur-md min-w-[220px]">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-gold/10"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-gold transition-all duration-300 ease-out"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
            />
          </svg>
          <span className="absolute font-sans text-xs text-gold font-medium">{Math.round(progress)}%</span>
        </div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-muted mt-4 font-sans font-light">
          Carregando Modelo 3D
        </p>
      </div>
    </Html>
  )
}

// Componente Presenter unificado que lida com renderização e animação (DRY)
function MouthPresenter({ geometries }: MouthPresenterProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const upperGroupRef = useRef<THREE.Group>(null)
  const lowerGroupRef = useRef<THREE.Group>(null)
  const offsetRef = useRef(0)

  // Computa a caixa delimitadora combinada para centralizar e escalonar
  const { center, scale } = useMemo(() => {
    const box = new THREE.Box3()
    const geoms = [
      geometries.lowerBase,
      geometries.upperBase,
      geometries.lowerTeeth,
      geometries.upperTeeth
    ]

    geoms.forEach((geom) => {
      geom.computeBoundingBox()
      if (geom.boundingBox) {
        box.union(geom.boundingBox)
      }
    })

    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1.2 / maxDim

    return { center, scale }
  }, [geometries])

  // Rotação suave contínua e animação de separação ao passar o mouse
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    groupRef.current.rotation.y = Math.sin(t / 4) / 4
    groupRef.current.rotation.x = Math.cos(t / 4) / 8

    // Movimento rápido de abrir/fechar (lerp 0.22)
    const targetOffset = hovered ? 8 : 0
    offsetRef.current = THREE.MathUtils.lerp(offsetRef.current, targetOffset, 0.22)

    if (upperGroupRef.current) {
      upperGroupRef.current.position.z = offsetRef.current
    }
    if (lowerGroupRef.current) {
      lowerGroupRef.current.position.z = -offsetRef.current
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group rotation={[-Math.PI / 2, 0, Math.PI]} scale={[scale, scale, scale]}>
        <group position={[-center.x, -center.y, -center.z]}>
          <group ref={upperGroupRef}>
            <mesh geometry={geometries.upperBase} material={gumMaterial} />
            <mesh geometry={geometries.upperTeeth} material={teethMaterial} />
          </group>
          <group ref={lowerGroupRef}>
            <mesh geometry={geometries.lowerBase} material={gumMaterial} />
            <mesh geometry={geometries.lowerTeeth} material={teethMaterial} />
          </group>
        </group>
      </group>
    </group>
  )
}

// Provedor de dados GLB de alta performance
function MouthStructureGLB() {
  const { nodes } = useGLTF('/dentadura/dentadura_otimizada_low.glb') as unknown as GLTFResult

  const geometries = useMemo(() => ({
    lowerBase: nodes.lowerBase.geometry,
    upperBase: nodes.upperBase.geometry,
    lowerTeeth: nodes.lowerTeeth.geometry,
    upperTeeth: nodes.upperTeeth.geometry,
  }), [nodes])

  return <MouthPresenter geometries={geometries} />
}

// Provedor de dados STL de fallback com otimização de vértices local
function MouthStructureSTL() {
  const lowerBase = useLoader(STLLoader, '/dentadura/Lower Denture Base - Vladyslav Pereverzyev.stl')
  const upperBase = useLoader(STLLoader, '/dentadura/Upper Denture Base - Vladyslav Pereverzyev.stl')
  const lowerTeeth = useLoader(STLLoader, '/dentadura/Lower Denture Teeth - Vladyslav Pereverzyev.stl')
  const upperTeeth = useLoader(STLLoader, '/dentadura/Upper Denture Teeth - Vladyslav Pereverzyev.stl')

  const geometries = useMemo(() => {
    try {
      const lowerBaseOpt = BufferGeometryUtils.mergeVertices(lowerBase)
      lowerBaseOpt.computeVertexNormals()

      const upperBaseOpt = BufferGeometryUtils.mergeVertices(upperBase)
      upperBaseOpt.computeVertexNormals()

      const lowerTeethOpt = BufferGeometryUtils.mergeVertices(lowerTeeth)
      lowerTeethOpt.computeVertexNormals()

      const upperTeethOpt = BufferGeometryUtils.mergeVertices(upperTeeth)
      upperTeethOpt.computeVertexNormals()

      return {
        lowerBase: lowerBaseOpt,
        upperBase: upperBaseOpt,
        lowerTeeth: lowerTeethOpt,
        upperTeeth: upperTeethOpt
      }
    } catch (e) {
      console.warn('Falha ao otimizar geometrias STL. Usando as originais:', e)
      return { lowerBase, upperBase, lowerTeeth, upperTeeth }
    }
  }, [lowerBase, upperBase, lowerTeeth, upperTeeth])

  return <MouthPresenter geometries={geometries} />
}

export function MouthModel3D() {
  const [glbFailed, setGlbFailed] = useState(false)

  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          precision: 'mediump'
        }}
      >
        <React.Suspense fallback={<Loader />}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.2} />
          <directionalLight position={[-10, -5, -10]} intensity={0.4} />
          <directionalLight position={[0, 10, 5]} intensity={0.5} />

          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
            <ErrorBoundary
              fallback={<MouthStructureSTL />}
              onError={(err) => {
                console.warn('Falha ao carregar o GLB otimizado. Usando STL como fallback:', err)
                setGlbFailed(true)
              }}
            >
              {!glbFailed ? <MouthStructureGLB /> : <MouthStructureSTL />}
            </ErrorBoundary>
          </Float>

          <Environment preset="city" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={6} blur={2.5} far={3} frames={1} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.15}
            rotateSpeed={1.8}
            maxPolarAngle={Math.PI / 2 + 0.3}
            minPolarAngle={Math.PI / 4}
          />
        </React.Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] uppercase tracking-[0.2em] text-gold/80 bg-dark/50 px-4 py-2 rounded-full backdrop-blur-sm z-10 font-sans">
        Arraste para girar • Passe o mouse para separar
      </div>
    </div>
  )
}

// Pré-carrega o GLB otimizado para download instantâneo quando o site carregar
try {
  useGLTF.preload('/dentadura/dentadura_otimizada_low.glb')
} catch (e) {
  // Ignora falhas de preload fora da renderização
}



