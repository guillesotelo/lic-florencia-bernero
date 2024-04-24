import React from 'react'
import Running from '../../assets/images/site/running1.jpg'
import Button from '../../components/Button/Button'
import { useHistory } from 'react-router-dom'
import { APP_COLORS } from '../../constants'

type Props = {}

export default function Home({ }: Props) {
  const history = useHistory()

  return (
    <div className='home__container'>
      <div className="home__section">
        <div className="home__landing">
          <div className="home__landing-text">
            <div className="home__landing-text-row">
              <h1 className="home__landing-title">Equilibrio<br />y Superación</h1>
              <h2 className="home__landing-subtitle">Psicología Deportiva y Bienestar Integral</h2>
            </div>
            <Button
              label='Reserva una cita'
              handleClick={() => history.push('/booking')}
              style={{ transform: 'scale(1.5)', height: 'fit-content' }}
              bgColor={APP_COLORS.SALMON}
            />
          </div>
          <img src={Running} alt="" className="home__landing-img" />
        </div>
      </div>
    </div>
  )
}