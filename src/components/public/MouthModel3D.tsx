import React, { useRef, useState, useMemo, useEffect, Component, ReactNode } from 'react'
// @ts-ignore
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Html, useProgress, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Definição de tipos estritos para o resultado do useGLTF
interface GLTFResult {
  nodes: {
    lowerBase: THREE.Object3D
    upperBase: THREE.Object3D
    lowerTeeth: THREE.Object3D
    upperTeeth: THREE.Object3D
  }
}

interface MouthPresenterProps {
  geometries: {
    lowerBase: THREE.BufferGeometry
    upperBase: THREE.BufferGeometry
    lowerTeeth: THREE.BufferGeometry
    upperTeeth: THREE.BufferGeometry
  }
  hovered: boolean
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

// Componente de carregamento para mostrar o progresso do download com um dente pulando
function Loader() {
  const loaderStyle = `
    @keyframes toothBounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-12px);
      }
    }
  `

  return (
    <Html center>
      <style dangerouslySetInnerHTML={{ __html: loaderStyle }} />
      <div className="flex flex-col items-center justify-center bg-dark/95 p-6 rounded-2xl border border-gold/20 shadow-2xl backdrop-blur-md min-w-[180px]">
        <div 
          className="w-16 h-16 flex items-center justify-center"
          style={{ animation: 'toothBounce 0.8s infinite ease-in-out' }}
        >
          <svg viewBox="0 0 512 512" className="w-10 h-10 fill-gold">
            <path d="M154.1 52.1C137.3 39.1 116.7 32 95.5 32C42.7 32 0 74.7 0 127.5v6.2c0 15.8 3.7 31.3 10.7 45.5l23.5 47.1c4.5 8.9 7.6 18.4 9.4 28.2L80.4 460.2c2 11.2 11.6 19.4 22.9 19.8s21.4-7.4 24-18.4l28.9-121.3C160.2 323.7 175 312 192 312s31.8 11.7 35.8 28.3l28.9 121.3c2.6 11.1 12.7 18.8 24 18.4s20.9-8.6 22.9-19.8l36.7-205.8c1.8-9.8 4.9-19.3 9.4-28.2l23.5-47.1c7.1-14.1 10.7-29.7 10.7-45.5v-2.1c0-55-44.6-99.6-99.6-99.6c-24.1 0-47.4 8.8-65.6 24.6l-3.2 2.8 19.5 15.2c7 5.4 8.2 15.5 2.8 22.5s-15.5 8.2-22.5 2.8l-24.4-19-37-28.8z"/>
          </svg>
        </div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-gold font-sans font-light mt-2 animate-pulse">
          Carregando...
        </p>
      </div>
    </Html>
  )
}

// Componente Presenter unificado que lida com renderização e animação (DRY)
function MouthPresenter({ geometries, hovered }: MouthPresenterProps) {
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
    const scale = 1.75 / maxDim
 
    return { center, scale }
  }, [geometries])
 
  // Rotação suave contínua e animação de separação ao passar o mouse
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
 
    groupRef.current.rotation.y = Math.sin(t / 4) / 4
    groupRef.current.rotation.x = Math.cos(t / 4) / 8
 
    // Movimento rápido de abrir/fechar (lerp 0.22)
    const targetOffset = hovered ? 1500 : 0
    offsetRef.current = THREE.MathUtils.lerp(offsetRef.current, targetOffset, 0.22)
 
    if (upperGroupRef.current) {
      upperGroupRef.current.position.z = offsetRef.current
    }
    if (lowerGroupRef.current) {
      lowerGroupRef.current.position.z = -offsetRef.current
    }
  })
 
  return (
    <group ref={groupRef}>
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
function MouthStructureGLB({ hovered }: { hovered: boolean }) {
  const { nodes } = useGLTF('/dentadura/dentadura_otimizada_low.glb') as unknown as GLTFResult
 
  const geometries = useMemo(() => {
    const getGeometry = (node: THREE.Object3D | undefined): THREE.BufferGeometry => {
      if (!node) return new THREE.BufferGeometry()
      if ((node as THREE.Mesh).isMesh && (node as THREE.Mesh).geometry) {
        return (node as THREE.Mesh).geometry
      }
      let geom: THREE.BufferGeometry | undefined
      node.traverse((child) => {
        if (!geom && (child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
          geom = (child as THREE.Mesh).geometry
        }
      })
      return geom || new THREE.BufferGeometry()
    }
 
    return {
      lowerBase: getGeometry(nodes.lowerBase),
      upperBase: getGeometry(nodes.upperBase),
      lowerTeeth: getGeometry(nodes.lowerTeeth),
      upperTeeth: getGeometry(nodes.upperTeeth),
    }
  }, [nodes])
 
  return <MouthPresenter geometries={geometries} hovered={hovered} />
}

export function MouthModel3D() {
  const [hovered, setHover] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [controlDom, setControlDom] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      setControlDom(containerRef.current)
    }
  }, [])

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative">
      {/* O Canvas preenche toda a div para evitar cortes do modelo/sombra */}
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
              fallback={
                <Html center>
                  <div className="text-red-500 bg-dark/90 p-4 rounded border border-red-500/20 text-center font-sans text-xs">
                    Erro ao carregar o modelo 3D.
                  </div>
                </Html>
              }
            >
              <MouthStructureGLB hovered={hovered} />
            </ErrorBoundary>
          </Float>
 
          <Environment preset="city" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={6} blur={2.5} far={3} frames={1} />
          
          {controlDom && (
            <OrbitControls
              domElement={controlDom}
              enableZoom={true}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.15}
              rotateSpeed={1.8}
              maxPolarAngle={Math.PI / 2 + 0.3}
              minPolarAngle={Math.PI / 4}
            />
          )}
        </React.Suspense>
      </Canvas>

      {/* Zona de interação centralizada e transparente (apenas próximo ao elemento 3D) */}
      <div
        ref={containerRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="absolute w-[360px] h-[360px] rounded-full cursor-grab active:cursor-grabbing z-20"
      />
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



