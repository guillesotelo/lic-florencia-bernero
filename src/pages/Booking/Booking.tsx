import React, { useState } from 'react'
import InputField from '../../components/InputField/InputField'
import { onChangeEventType } from '../../types'
import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { APP_COLORS, paisesHispanohablantes, provinciasArgentinas, tiposTerapias } from '../../constants'

type Props = {}

const defaultData = {
  fullname: '',
  email: '',
  phone: '',
  country: '',
  province: '',
  therapy: '',
  age: 18
}

export default function Booking({ }: Props) {
  const [data, setData] = useState(defaultData)
  const history = useHistory()

  const updateData = (key: string, e: onChangeEventType) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const discard = () => history.goBack()

  const book = async () => {
    try {
      // const booked = await newBooking(data)
      const booked = true
      if (booked) {
        toast.success('Reserva creada con éxito')
      } else toast.error('Ocurrió un error. Intenta nuevamente.')
    } catch (error) {
      toast.error('Ocurrió un error. Intenta nuevamente.')
      console.error(error)
    }
  }

  const getAges = () => Array.from({ length: 103 }).map((_, i) => i + 18)

  return (
    <div className="page__container">
      <div className="page__row">
        <div className="page__col booking__text-col">
          <h1>Reserva tu cita</h1>
          <p className='booking__text'>
            Completa el formulario con tus datos para asegurar tu consulta. Estamos aquí para ayudarte en tu viaje hacia el bienestar emocional y mental.
          </p>
        </div>
        <div className="page__col">
          <div className="booking__form-container">
            <div className="booking__form">
              <h2 className='booking__form-title'>Nueva reserva</h2>
              <InputField
                label='Nombre completo'
                name='fullname'
                value={data.fullname}
                updateData={updateData}
              />
              <InputField
                label='Email'
                name='email'
                value={data.email}
                updateData={updateData}
              />
              <InputField
                label='Teléfono (opcional)'
                name='phone'
                value={data.phone}
                updateData={updateData}
                placeholder='+549-1234-5678'
              />
              <InputField
                label='Teléfono (opcional)'
                name='phone'
                value={data.phone}
                updateData={updateData}
                placeholder='+549-1234-5678'
              />
              <Dropdown
                label='Edad'
                options={getAges()}
                selected={data.age}
                value={data.age}
                setSelected={(value: number) => setData({ ...data, age: value })}
              />
              <Dropdown
                label='País de residencia'
                options={paisesHispanohablantes}
                selected={data.country}
                value={data.country}
                setSelected={(value: string) => setData({ ...data, country: value })}
              />
              {data.country ? data.country === 'Argentina' ?
                <Dropdown
                  label='Provincia de residencia'
                  options={provinciasArgentinas}
                  selected={data.province}
                  value={data.province}
                  setSelected={(value: string) => setData({ ...data, province: value })}
                />
                :
                <InputField
                  label='Provincia o estado'
                  name='province'
                  value={data.province}
                  updateData={updateData}
                /> : ''}
              <Dropdown
                label='Tipo de Terapia (opcional)'
                options={tiposTerapias}
                selected={data.therapy}
                value={data.therapy}
                setSelected={(value: string) => setData({ ...data, therapy: value })}
              />
              <Button
                label='Reservar'
                handleClick={book}
                bgColor={APP_COLORS.METAL}
                textColor='white'
                style={{ marginTop: '1rem' }}
              />
              <Button
                label='Descartar'
                handleClick={discard}
                style={{ marginTop: '.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}