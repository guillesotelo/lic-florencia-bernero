import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../components/InputField/InputField'
import { dataObj, onChangeEventType } from '../../types'
import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { APP_COLORS, dateOptions, paisesHispanohablantes, provinciasArgentinas, services, timeOptions, tiposTerapias, weekDays } from '../../constants'
import Calendar from "react-calendar"
import { TileDisabledFunc } from "react-calendar/dist/cjs/shared/types"
import { AppContext } from '../../AppContext'
import { createBooking, getAllServices } from '../../services'
type Props = {}

const defaultData: dataObj = {
  fullname: '',
  email: '',
  phone: '',
  country: '',
  province: '',
  age: 18,
}

const parseData: dataObj = {
  fullname: 'Nombre completo',
  email: 'Email',
  phone: 'Teléfono',
  country: 'País de residencia',
  province: 'Provincia',
  therapy: 'Tipo de Terapia',
  age: 'Edad',
  date: 'Fecha y hora'
}

export default function Booking({ }: Props) {
  const [data, setData] = useState(defaultData)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [booked, setBooked] = useState(false)
  const [loading, setLOading] = useState(false)
  const [service, setService] = useState('')
  const [allServices, setAllServices] = useState<any[]>([])
  const [serviceData, setServiceData] = useState<dataObj>({})
  const history = useHistory()
  const { isMobile } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    const _service = new URLSearchParams(document.location.search).get('service')
    if (_service) {
      setService(getServiceName(_service))
    }
    getServices()
  }, [location])

  useEffect(() => {
    if (service) {
      const selected = allServices.find(s => s.name === service)
      if (selected && selected._id) setServiceData(selected)
    }
  }, [allServices, service])

  const updateData = (key: string, e: onChangeEventType) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const discard = () => history.goBack()

  const book = async () => {
    try {
      setLOading(true)
      const bookingData = { ...data }
      bookingData.service = service.toLocaleLowerCase().split(' ').join('-')
      const created = await createBooking(data)
      if (created) {
        toast.success('Reserva creada con éxito')
        setTimeout(() => {
          setBooked(true)
          setLOading(false)
        }, 2000)
      } else toast.error('Ocurrió un error. Intenta nuevamente.')
    } catch (error) {
      setLOading(false)
      toast.error('Ocurrió un error. Intenta nuevamente.')
      console.error(error)
    }
  }

  const getServices = async () => {
    try {
      const services = await getAllServices()
      if (services && services.length) setAllServices(services)
    } catch (err) {
      console.error(err)
    }
  }

  const getAges = () => Array.from({ length: 103 }).map((_, i) => i + 18)

  const tileDisabled: TileDisabledFunc = ({ activeStartDate, date, view }): boolean => {
    const day = date.getDay()
    const today = new Date()
    const isTodayOrBefore = date <= today
    const allSlots: any = []
    let count = 0
    let processedDates: any[] = []

    allSlots.forEach((d: Date) => {
      if (!processedDates.includes(d) && d.toLocaleDateString() === date.toLocaleDateString()) {
        processedDates.push(d)
        count++
      }
    })
    const serviceDays = (serviceData.day || '').toLowerCase()
    let disabled = [0, 1, 2, 3, 4, 5, 6]
    weekDays.map((weekday: string, i) => {
      if (serviceDays.includes(weekday.toLowerCase())) disabled = disabled.filter(n => n !== i)
    })
    if (serviceDays) return disabled.includes(day) || isTodayOrBefore || count > 1
    return false
  }

  const getTimeOptions = () => {
    return Array.from({ length: 10 })
      .map((_, i) => {
        return {
          value: new Date(new Date(new Date(data.date || new Date()).setHours(8 + i)).setMinutes(0)),
          label: new Date(new Date(new Date(data.date || new Date()).setHours(8 + i)).setMinutes(0)).toLocaleString('es-ES', timeOptions)
        }
      })
  }

  const checkData = () => data.fullname && data.email && data.email.includes('.')
    && data.email.includes('@') && data.date && data.fullname.includes(' ')

  const getServiceName = (service: string) => {
    return services[service]
  }

  const renderNewBooking = () => {
    return (
      <div
        className="page__row"
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          margin: isMobile ? '2rem 1rem' : '',
        }}
      >
        <div className="page__col booking__text-col" style={{ width: isMobile ? '90vw' : '' }}>
          <h1 className='booking__title'>{service}</h1>
          <h2 className='booking__subtitle'>Reserva tu cita</h2>
          <p className='booking__text'>
            Completa el formulario con tus datos para asegurar tu consulta. Estamos aquí para ayudarte en tu viaje hacia el bienestar emocional y mental.
          </p>
        </div>
        <div className="page__col">
          <div className="booking__form-container">
            <div className="booking__form" style={{ width: isMobile ? '80vw' : '' }}>
              {/* <h2 className='booking__form-title'>Nueva reserva</h2> */}
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
                options={['Psicoterapia', 'Entrenamiento en Habilidades', 'Valoraciones Neurocognitivas']}
                selected={service}
                value={service}
                setSelected={setService}
              />
              <div className="booking__form-datepicker">
                {openCalendar ?
                  <Calendar
                    locale='es'
                    onChange={(value: any) => {
                      setData({ ...data, date: new Date(new Date(value.setHours(12)).setMinutes(0)) })
                      setOpenCalendar(false)
                    }}
                    value={data.date}
                    tileDisabled={tileDisabled}
                    className='react-calendar'
                  />
                  :
                  <>
                    <Button
                      label={data.date ? new Date(data.date).toLocaleString('es-ES', dateOptions) : 'Seleccionar fecha'}
                      handleClick={() => setOpenCalendar(!openCalendar)}
                      bgColor={APP_COLORS.METAL}
                      textColor='white'
                      style={{ marginTop: '1rem', width: '50%' }}
                    />
                    <Dropdown
                      label=''
                      options={getTimeOptions()}
                      selected={data.date}
                      value={data.date ? new Date(data.date).toLocaleString('es-ES', timeOptions) : 'Seleccionar hora'}
                      setSelected={(item: dataObj) => setData({ ...data, date: item.value })}
                      objKey='label'
                      style={{ width: '45%', marginLeft: '.5rem' }}
                      disabled={!data.date}
                      maxHeight='20vh'
                    />
                  </>
                }
              </div>
              <Button
                label='Reservar'
                handleClick={book}
                bgColor={APP_COLORS.METAL}
                textColor='white'
                style={{ marginTop: '1rem' }}
                disabled={!checkData() || loading}
              />
              <Button
                label='Descartar'
                handleClick={discard}
                style={{ marginTop: '.5rem' }}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCurrentBooking = () => {
    return (
      <div
        className="page__row"
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          margin: isMobile ? '2rem 1rem' : '',
        }}>
        <div className="page__col booking__text-col" style={{ width: 'fit-content', margin: 0 }}>
          <h1>Cita confirmada!</h1>
          <p className='booking__text'>
            Estos son los datos de tu reserva:
          </p>
          <p className='booking__text'>
            {Object.keys(data).map((key: string, i) => <p key={i}><strong>{parseData[key]}: </strong>
              {data[key] instanceof Date ?
                new Date(data[key]).toLocaleString('es-ES', dateOptions) + ', ' + new Date(data[key]).toLocaleString('es-ES', timeOptions)
                : data[key]}</p>)}
          </p>
          <Button
            label='Listo'
            bgColor={APP_COLORS.METAL}
            textColor='white'
            handleClick={() => history.push('/')} />
        </div>
      </div>
    )
  }

  return (
    <div className="page__container">
      {booked ? renderCurrentBooking() : renderNewBooking()}
    </div>
  )
}