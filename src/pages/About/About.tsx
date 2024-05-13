import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import Florencia from '../../assets/images/site/about.jpeg'
type Props = {}

export default function About({ }: Props) {
    const { isMobile } = useContext(AppContext)
    return (
        <div className="page__centered">
            <div className="privacy__container" style={{ width: isMobile ? '95%' : '50%', margin: '2rem' }}>
                <h1>Sobre mí</h1>


                <div className=""
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '1rem'
                    }}>
                    <div>
                        <p>Muchas veces me preguntan, ¿Por qué Psicóloga? ¿Te gusta trabajar con problemas? Este interrogante me ha posibilitado generar lucidez respecto a para qué hago lo que hago. Y no, no es particularmente el hecho de trabajar con problemas lo que me motiva a ejercer mi profesión, sino la posibilidad de poder conectar con lo profundo de otro ser humano, donde a partir de la combinación de Ciencia y Arte, mis dos grandes pasiones, tengo la oportunidad de ofrecer espacios de contención, así como de brindar herramientas dirigidas a trabajar en relación a procesos que implican la búsqueda por el alivio del sufrimiento y la construcción de vidas valiosas. Respecto a esto, algo que siempre les transmito a mis consultantes, es que muchas veces, el dolor va a estar formando parte de nuestra experiencia, pero lo que hacemos con y a partir de lo que sentimos, es de alguna manera, nuestro superpoder. Además, los animo a notar que, a partir de la forma y expresión de nuestros pensamientos y acciones, podemos conectar con un estado de libertad que nos posibilita acercarnos a construir una vida donde podamos sentirnos en coherencia y en el mejor de los casos, a gusto.</p>

                        <p>Estudié Licenciatura en Psicología en la Universidad Nacional de Córdoba (Argentina), donde, además de cursar la carrera, tuve la oportunidad de formar parte de diversos espacios asociados a las Neurociencias, área que desde siempre ha captado mi interés.</p>

                        <p>Me apasiona estudiar la plasticidad cerebral y el poder transmitir que todo ser humano cuenta con la posibilidad de incorporar maneras más amables de ser y estar. En relación a esto, decidí focalizar mi ejercicio profesional en el acompañamiento de personas en sus procesos de aceptación y cambio, así como en el entrenamiento en habilidades que les permitan conectar con una mejor calidad de vida.</p>

                        <p>Actualmente tengo la oportunidad de trabajar con consultantes Hispanohablantes de diferentes partes del mundo y con organizaciones que desean fomentar la adquisición de habilidades en sus integrantes, con el fin de optimizar su bienestar y rendimiento.</p>
                    </div>
                    <img src={Florencia} style={{ height: '50vh', borderRadius: '50%', boxShadow: '.2rem .2rem 1rem #0000004f'}} alt="Florencia Bernero" className="" />
                </div>

                <h2>Especialidades</h2>

                <ul>
                    <li>● Ansiedad</li>
                    <li>● TOC</li>
                    <li>● Hipocondriasis</li>
                    <li>● Trastorno de pánico</li>
                    <li>● Fobias</li>
                    <li>● Ansiedad social</li>
                    <li>● Trastorno de Estrés Post Traumático</li>
                    <li>● Trastorno de ansiedad generalizada</li>
                    <li>● Depresión</li>
                    <li>● Estrés</li>
                    <li>● Crisis vitales</li>
                </ul>

                <h2>Experiencia</h2>

                <ul>
                    <li>● Procesos de Psicoterapia (Modalidad individual y grupal)</li>
                    <li>● Entrenamiento en Habilidades</li>
                    <li>● Neuropsicología</li>
                </ul>

                <h2>Destinatarios:</h2>

                <ul>
                    <li>● Jóvenes (a partir de los 18 años)</li>
                    <li>● Adultos</li>
                    <li>● Adultos mayores</li>
                    <li>● Empresas/organizaciones</li>
                </ul>

                <p><i>Escribinos 24/7. Estamos a disposición para resolver cualquier consulta.</i></p>

                <h2>Tipos de terapia:</h2>

                <ul>
                    <li>● Cognitivo conductual</li>
                    <li>● Terapia de aceptación y compromiso</li>
                    <li>● Mindfulness</li>
                </ul>

            </div>
        </div>
    )
}