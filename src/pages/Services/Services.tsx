import { useContext, useEffect } from 'react'
import { AppContext } from '../../AppContext'
import { scrollToSection } from '../../helpers'
import { useLocation } from 'react-router-dom'
type Props = {}

export default function Services({ }: Props) {
    const { isMobile } = useContext(AppContext)
    const location = useLocation()

    useEffect(() => {
        const serviceId = new URLSearchParams(document.location.search).get('serviceId')
        if (serviceId) scrollToSection(serviceId)
    }, [location])

    return (
        <div className="page__centered">
            <div id='psicoterapia'></div>
            <div className="privacy__container" style={{ width: isMobile ? '95%' : '50%', margin: '2rem' }}>
                <h1>Servicios</h1>

                <h2>Psicoterapia</h2>
                <p>Se trata de una modalidad de Psicoterapia que permite llevar a cabo procesos Psicoterapéuticos con la misma efectividad que la modalidad presencial, añadiendo múltiples beneficios, como el ahorro de tiempo y transporte. Las sesiones se realizan a través de diferentes plataformas y medios digitales, como Google Meet, Zoom, WhatsApp, etc.</p>

                <div id='entrenamiento-en-habilidades'></div>
                <div style={{ margin: '4rem 0', borderBottom: '1px solid lightgray' }}></div>

                <h2>Entrenamiento en Habilidades</h2>
                <p>El consultante (particular u organizacional), puede requerir el entrenamiento exclusivo en una o varias de las siguientes habilidades:</p>
                <ul>
                    <li>● Habilidades de conciencia plena (Entrenamiento en Mindfulness y conexión con el momento presente)</li>
                    <li>● Habilidades de regulación emocional</li>
                    <li>● Habilidades de Efectividad Interpersonal</li>
                    <li>● Habilidades de aceptación radical</li>
                </ul>

                <div id='valoraciones-neurocognitivas'></div>
                <div style={{ margin: '4rem 0', borderBottom: '1px solid lightgray' }}></div>

                <h2>Valoraciones Neurocognitivas</h2>
                <h3>¿En qué consiste una Valoración Neurocognitiva?</h3>
                <p>La evaluación neuropsicológica o valoración neurocognitiva se trata de un estudio que permite determinar el estado o funcionamiento cognitivo de una persona en diferentes áreas, tales como la memoria, funciones visuoespaciales, atención, etc. Se caracteriza por ser un estudio no invasivo, sino que su base es la aplicación de técnicas o test que brindan información no provista por otros métodos de estudio como el electroencefalograma, la tomografía computada o la resonancia magnética.</p>
                <p>Es de destacar que no sólo se administra a pacientes con posible deterioro, sino que también se encuentra dirigida a personas que desean conocer su performance cognitiva (estado de su memoria, atención, etc.) en distintas etapas de la vida.</p>

                <h3>¿Qué estudiamos específicamente a través de una Evaluación Neurocognitiva?</h3>
                <p>Ayuda a determinar el nivel de funcionamiento del individuo en las siguientes áreas:</p>
                <ul>
                    <li>● Atención</li>
                    <li>● Memoria</li>
                    <li>● Capacidad de aprender cosas nuevas</li>
                    <li>● Habilidades visuoespaciales y construccionales</li>
                    <li>● Orientación geográfica</li>
                    <li>● Funciones ejecutivas</li>
                    <li>● Conducta social y emocional, etc.</li>
                </ul>

                <h3>¿Qué debe llevar si se realiza una Evaluación Neuropsicológica o neurocognitiva?</h3>
                <p>Es importante que si utiliza alguno de estos elementos o si ya se ha realizado alguno de los estudios que mencionaremos a continuación, pueda presentarlos el día de su turno.</p>
                <ul>
                    <li>● Lentes y audífonos (si los usa).</li>
                    <li>● Lista de medicamentos que consume (dosis).</li>
                    <li>● Análisis de sangre recientes (para observar niveles de colesterol, triglicéridos).</li>
                    <li>● Si tiene estudios de Neuroimagen estructural y funcional como TAC (tomografía axial computarizada), RMN (Resonancia Magnética Nuclear), SPECT, PET, RMNf, entre otras.</li>
                </ul>
                <p>Se aconseja llegar descansado y en lo posible bien alimentado.</p>

                <h3>Destinatarios</h3>
                <p>Realizamos evaluaciones neuropsicológicas a:</p>
                <ul>
                    <li>● Jóvenes (A partir de los 18 años de edad).</li>
                    <li>● Adultos.</li>
                    <li>● Adultos Mayores.</li>
                </ul>
            </div>
        </div>
    )
}