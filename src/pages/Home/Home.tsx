import { useEffect, useState } from 'react'
import BG from '../../assets/images/site/BG.jpeg'
import Button from '../../components/Button/Button'
import { useHistory } from 'react-router-dom'
import { APP_COLORS } from '../../constants'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import ServiceImage1 from '../../assets/images/site/services/1.png'
import ServiceImage2 from '../../assets/images/site/services/2.png'
import ServiceImage4 from '../../assets/images/site/services/4.png'
import Whatsapp from '../../assets/icons/whatsapp.svg'
import WhatsappChat from '../../components/WhatsappChat/WhatsappChat'

type Props = {}

export default function Home({ }: Props) {
  const [renderIntro, setRenderIntro] = useState(false)
  const [renderServices, setRenderServices] = useState(false)
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const history = useHistory()
  const message = 'Hola Florencia! Me gustaría ponerme en contacto contigo para conocer más sobre tus servicios.'

  useEffect(() => {
    window.addEventListener('scroll', function () {
      const items = document.querySelectorAll('.scroll-item')
      items.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top
        const screenHeight = window.innerHeight

        if (itemPosition < screenHeight) {
          if (item.classList.contains('home__section-intro')) setRenderIntro(true)
          if (item.classList.contains('home__section-services')) setRenderServices(true)

          item.classList.remove('disappear')
          item.classList.add('appear-down')
        } else {
          if (item.classList.contains('appear-down')) {
            item.classList.remove('appear-down')
            item.classList.add('disappear')
          }
        }
      })
    })

    setTimeout(() => setShowWhatsapp(true), 3000)
  }, [])


  useEffect(() => {
    const body = document.querySelector('body')
    if (body) {
      if (showChat) body.style.overflow = 'hidden'
      else body.style.overflow = 'auto'
    }
  }, [showChat])

  const renderHome = () => {
    return (
      <div className='page__row'>
        <div className='home__container'>
          <div className="home__landing" style={{ filter: showChat ? 'contrast(.3)' : 'contrast(1)' }}>
            <div className="home__landing-text">
              <div className="home__landing-text-col">
                <div>
                  <h1 className="home__landing-title">Equilibrio<br />y Superación</h1>
                  <h2 className="home__landing-subtitle">Psicología y entrenamiento en habilidades</h2>
                </div>
              </div>
              <div className="home__landing-text-col">
                <div style={{ textAlign: 'center' }}>
                  <p className='home__landing-cta'>Tu primer paso hacia una vida mejor</p>
                  <Button
                    label='Reserva una cita'
                    handleClick={() => history.push('/new-booking')}
                    style={{
                      fontSize: '1.2rem',
                      height: 'fit-content',
                      width: 'fit-content',
                      opacity: 0,
                      animation: 'fade-in-up 2s ease forwards',
                      animationDelay: '1.5s'
                    }}
                    bgColor={APP_COLORS.HONEYDEW}
                  />
                </div>
              </div>
            </div>
            <div className="home__landing-img-gradient" />
            <img src={BG} alt="Equilibrio y Superación (imagen)" className="home__landing-img" />
          </div>

          <div className="home__section-intro scroll-item"></div>
          {renderIntro ?
            <>
              <div className="home__section" style={{ filter: showChat ? 'contrast(.3)' : 'contrast(1)' }}>
                <div className="home__section-col" style={{ textAlign: 'center' }}>
                  <p className='home__section-text scroll-item' style={{ fontSize: '2.5rem', margin: '0 0 5vh 0' }}>Hola, muchas gracias por estar acá.</p>
                  <p className='home__section-text scroll-item'>Este espacio se encuentra dedicado a la Psicología y al entrenamiento en habilidades asociadas al bienestar:</p>
                  <div className='home__section-col' style={{ width: '100%', justifyContent: 'space-between', marginTop: '6vh' }}>
                    <p className='home__section-text-module' style={{ animationDelay: '1.5s' }}>Habilidades de conexión con el momento presente (a través de la práctica del mindfulness).</p>
                    <p className='home__section-text-module' style={{ animationDelay: '2s' }}>Habilidades de efectividad interpersonal.</p>
                    <p className='home__section-text-module' style={{ animationDelay: '2.5s' }}>Habilidades de regulación emocional.</p>
                    <p className='home__section-text-module' style={{ animationDelay: '3s' }}>Habilidades de aceptación radical.</p>
                  </div>
                </div>
              </div>

              <div className="home__section" style={{ backgroundColor: '#e8e8e8', filter: showChat ? 'contrast(.3)' : 'contrast(1)' }}>
                <div className="home__section-col" style={{ textAlign: 'center' }}>
                  <p className='home__section-text scroll-item' style={{ fontSize: '1.4rem', margin: '1rem 0', animationDelay: '.5s' }}>
                    En la actualidad, sabemos que cuando integramos estas habilidades a nuestras vidas, a través de la práctica, podemos transformar nuestra manera de estar en el mundo, logrando atravesar esta experiencia conectados a lo que nos ofrece el momento presente, y acercándonos, a partir del vínculo con nuestros pensamientos y acciones, a la persona que queremos ser y a la vida que deseamos habitar.
                  </p>

                  <p className='home__section-text scroll-item' style={{ fontSize: '1.4rem', margin: '1rem 0', animationDelay: '.9s' }}>
                    Aquí encontrarás un lugar seguro, donde trabajaremos en relación a tu experiencia vital actual, a través de un proceso de Psicoterapia y/o del entrenamiento en habilidades. Nos propondremos objetivos y estableceremos un plan de abordaje de los mismos, con el fin de poder alcanzarlos.
                  </p>

                  <p className='home__section-text scroll-item' style={{ fontSize: '1.4rem', margin: '1rem 0', animationDelay: '1.2s' }}>
                    ¿Nuestro Norte? Aquello que valores y que sea  importante para vos en este momento.
                  </p>

                  <p className='home__section-text scroll-item' style={{ fontSize: '1.4rem', margin: '1rem 0', animationDelay: '1.7s' }}>
                    Gracias por confiar en mí, si deseas comenzar a trabajar en tu salud mental y/o  bienestar, no dudes en ponerte en <a href='/contacto'>contacto</a> conmigo.
                  </p>
                </div>
              </div>
            </>
            : ''}

          <div
            className="home__section"
            style={{
              backgroundColor: 'white',
              filter: showChat ? 'contrast(.3)' : 'contrast(1)'
            }}>
            <div className="home__col">
              <p className="home__section-title scroll-item">Servicios</p>
              <div className="home__section-services scroll-item"></div>
              {renderServices ?
                <div className="home__section-wrap">
                  <ServiceCard
                    image={ServiceImage2}
                    title='Psicoterapia'
                    description='Se trata de una modalidad de Psicoterapia que permite llevar a cabo procesos Psicoterapéuticos con la misma efectividad que la modalidad presencial, añadiendo múltiples beneficios, como el ahorro de tiempo y transporte.
                  Las sesiones se realizan a través de diferentes plataformas y medios digitales, como Google Meet, zoom, whatsapp, etc. 
                  '
                    buttonLabel='Reservar'
                    handleButton={() => history.push('/new-booking?serviceId=6641d7777a4bc7c2193cbf50')}
                    delay='1s'
                    handleReadMore={() => history.push('/services?serviceId=psicoterapia')}
                  />

                  <ServiceCard
                    image={ServiceImage1}
                    title='Entrenamiento en Habilidades'
                    description='El consultante (particular u organizacional), puede requerir el entrenamiento exclusivo en una o varias de las siguientes habilidades:
 
                  -Habilidades de conciencia plena (Entrenamiento en Mindfulness y conexión con el momento presente)
                  -Habilidades de regulación emocional
                  -Habilidades de Efectividad Interpersonal
                  -Habilidades de aceptación radical
                  '
                    buttonLabel='Reservar'
                    handleButton={() => history.push('/new-booking?serviceId=6641dd8b7a4bc7c2193cbf59')}
                    delay='1.5s'
                    handleReadMore={() => history.push('/services?serviceId=entrenamiento-en-habilidades')}
                  />

                  <ServiceCard
                    image={ServiceImage4}
                    title='Valoraciones Neurocognitivas'
                    description='La evaluación neuropsicológica o valoración neurocognitiva se trata de un estudio que permite determinar el estado o funcionamiento cognitivo de una persona en diferentes áreas, tales como la memoria, funciones visuoespaciales, atención, etc.
                  Se caracteriza por ser un estudio no invasivo, sino que su base es la aplicación de técnicas o test que brindan información no provista por otros métodos de estudio como el electroencefalograma, la tomografía computada o la resonancia magnética.
                  Es de destacar que no sólo se administra a pacientes con posible deterioro, sino que también se encuentra dirigida a personas que desean conocer su performance cognitiva (estado de su memoria, atención, etc.) en distintas etapas de la vida.
                  '
                    buttonLabel='Reservar'
                    handleButton={() => history.push('/new-booking?serviceId=6641e7437a4bc7c2193cbfbe')}
                    delay='2s'
                    handleReadMore={() => history.push('/services?serviceId=valoraciones-neurocognitivas')}
                  />
                </div>
                : ''}
            </div>
          </div>

          {showWhatsapp ?
            <div className="home__whatsapp">
              {showChat ?
                <WhatsappChat onClose={() => setShowChat(false)} message={message} />
                :
                <img src={Whatsapp} alt="Whatsapp Me" onClick={() => setShowChat(true)} className="home__whatsapp-img" />
              }
            </div>
            : ''}
        </div>
      </div>
    )
  }

  return renderHome()
}