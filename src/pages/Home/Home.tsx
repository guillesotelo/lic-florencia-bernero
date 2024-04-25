import React, { useContext } from 'react'
import Running from '../../assets/images/site/running1.jpg'
import Button from '../../components/Button/Button'
import { useHistory } from 'react-router-dom'
import { APP_COLORS } from '../../constants'
import { AppContext } from '../../AppContext'

type Props = {}

export default function Home({ }: Props) {
  const history = useHistory()
  const { isMobile } = useContext(AppContext)

  const renderDesktop = () => {
    return (
      <div className='page__row'>
        <div className='home__container'>
          <div className="home__section">
            <div className="home__landing">
              <div className="home__landing-text">
                <div className="home__landing-text-col">
                  <h1 className="home__landing-title">Equilibrio<br />y Superación</h1>
                  <h2 className="home__landing-subtitle">Psicología Deportiva y Bienestar Integral</h2>
                  <div style={{ textAlign: 'center', width: '100vw' }}>
                    <p className='home__landing-cta'>Da el primer paso hacia una vida mejor</p>
                    <Button
                      label='Reserva una cita'
                      handleClick={() => history.push('/booking')}
                      style={{
                        transform: 'scale(1.5)',
                        height: 'fit-content',
                        width: 'fit-content',
                        opacity: 0,
                        animation: 'fade-in 2s ease forwards',
                        animationDelay: '1.5s'
                      }}
                      bgColor={APP_COLORS.SKY}
                    />
                  </div>
                </div>
                <div className="home__landing-text-col" style={{ textAlign: 'left', alignItems: 'center' }}>
                </div>
              </div>
              <div className="home__landing-img-gradient" />
              <img src={Running} alt="Equilibrio y Superación (imagen)" className="home__landing-img" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMobile = () => {
    return (
      <div className='page__row'>
        <div className='home__container'>
          <div className="home__section">
            <div className="home__landing">
              <div className="home__landing-text">
                <div className="home__landing-text-col">
                  <h1 className="home__landing-title">Equilibrio<br />y Superación</h1>
                  <h2 className="home__landing-subtitle">Psicología Deportiva y Bienestar Integral</h2>
                  <div style={{ textAlign: 'center', width: '100vw' }}>
                    <p className='home__landing-cta'>Da el primer paso hacia una vida mejor</p>
                    <Button
                      label='Reserva una cita'
                      handleClick={() => history.push('/booking')}
                      style={{
                        transform: 'scale(1.5)',
                        height: 'fit-content',
                        width: 'fit-content',
                        opacity: 0,
                        animation: 'fade-in 2s ease forwards',
                        animationDelay: '1.5s'
                      }}
                      bgColor={APP_COLORS.SKY}
                    />
                  </div>
                </div>
                <div className="home__landing-text-col" style={{ textAlign: 'left', alignItems: 'center' }}>
                </div>
              </div>
              <div className="home__landing-img-gradient" />
              <img src={Running} alt="Equilibrio y Superación (imagen)" className="home__landing-img" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return isMobile ? renderMobile() : renderDesktop()
}