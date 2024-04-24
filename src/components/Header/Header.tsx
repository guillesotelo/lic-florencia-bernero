import React from 'react'
import Logo from '../../assets/images/logo/logo.png'
import IsologoRound from '../../assets/images/logo/isologo-round.png'
import { useHistory } from 'react-router-dom'

type Props = {}

export default function Header({ }: Props) {
  const history = useHistory()

  return (
    <div className="header__container">
      <div className="header__col">
        <div className="header__logo" onClick={() => history.push('/')}>
          <img src={IsologoRound} alt="Florencia Bernero" className="header__logo-img-iso" />
          <img src={Logo} alt="Florencia Bernero" className="header__logo-img" />
        </div>
      </div>
      <div className="header__col">
        <nav className="header__nav">
          <ul className='header__menu'>
            <li><a onClick={() => history.push('/')} className='header__menu-item'>Inicio</a></li>
            <li><a onClick={() => history.push('/recursos')} className='header__menu-item'>Recursos</a></li>
            <li><a onClick={() => history.push('/booking')} className='header__menu-item'>Reservar</a></li>
            <li><a onClick={() => history.push('/blog')} className='header__menu-item'>Blog</a></li>
            <li><a onClick={() => history.push('/contacto')} className='header__menu-item'>Contacto</a></li>
            <li><a onClick={() => history.push('/sobre-mi')} className='header__menu-item'>Sobre mí</a></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}