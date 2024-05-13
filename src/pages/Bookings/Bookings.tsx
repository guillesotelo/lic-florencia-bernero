import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import { dataObj } from '../../types'
import { bookingHeaders, eventHeaders, serviceHeaders, timeOptions, weekDays } from '../../constants'
import { createBooking, createService, deleteBooking, deleteService, getAllBookings, getAllServices, updateBooking, updateService, verifyToken } from '../../services'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import Dropdown from '../../components/Dropdown/Dropdown'
import Calendar from 'react-calendar'
import { TileDisabledFunc } from 'react-calendar/dist/cjs/shared/types'
import { AppContext } from '../../AppContext'
import { Calendar as EventCalendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import 'moment/locale/es'
import { createEvent, deleteEvent, getAllEvents, updateEvent } from '../../services/event'
import Switch from '../../components/Switch/Switch'
import Meet from '../../assets/icons/google-meet.svg'
import { parseDateTime, parsePrice } from '../../helpers'

type Props = {}

const voidEvent = {
    name: '',
    endTime: null,
    duration: 'Sin tope',
    description: '',
    discount: 'Sin descuento',
    image: '',
    price: 0,
    link: '',
    linkPassword: '',
    isVirtual: true,
}

const voidServiceData = {
    name: '',
    title: '',
    description: '',
    days: '',
    price: '',
    image: '',
}

const voidData = {
    name: '',
    endTime: null,
    duration: 'Sin tope',
    description: '',
    discount: 'Sin descuento',
    image: '',
    price: 0,
    link: '',
    linkPassword: '',
    isVirtual: true,
}

export default function Booking({ }: Props) {
    const [bookings, setBookings] = useState<any[]>([])
    const [selected, setSelected] = useState<number>(-1)
    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [tryToRemove, setTryToRemove] = useState<boolean>(false)
    const [isNewBooking, setIsNewBooking] = useState<boolean>(false)
    const [isPaid, setIsPaid] = useState<string>('')
    const [bookingSelected, setBookingSelected] = useState<any>({})
    const [discount, setDiscount] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('1 sesión')
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [openCalendar, setOpenCalendar] = useState(false)
    const [openCalendars, setOpenCalendars] = useState<any>({})
    const [eventClicked, setEventClicked] = useState<any>({})
    const [date, setDate] = useState<any>(null)
    const [selectedDates, setSelectedDates] = useState<any>([])
    const [view, setView] = useState(localStorage.getItem('bookingView') || 'Calendario')
    const [dbServices, setDbServices] = useState<any[]>([])
    const [dbServiceSelected, setDbServiceSelected] = useState<number>(-1)
    const [isNewService, setIsNewService] = useState(false)
    const [tryToRemoveService, setTryToRemoveService] = useState(false)
    const [serviceData, setServiceData] = useState<any>({})
    const [events, setEvents] = useState<any[]>([])
    const [eventSelected, setEventSelected] = useState<number>(-1)
    const [isNewEvent, setIsNewEvent] = useState(false)
    const [tryToRemoveEvent, setTryToRemoveEvent] = useState(false)
    const [eventData, setEventData] = useState<any>(voidEvent)
    const [endTime, setEndTime] = useState<any>(null)
    const [sendEmail, setSendEmail] = useState(true)
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [bookingServiceSelected, setBookingServiceSelected] = useState<dataObj>({})
    const history = useHistory()
    const { isMobile, isLoggedIn, setIsLoggedIn } = useContext(AppContext)

    useEffect(() => {
        verifyUser()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        getBookings()
        getServices()
        getEvents()
    }, [])

    useEffect(() => {
        const body = document.querySelector('body')
        const header = document.querySelector('.header__container') as HTMLElement
        if (selected !== -1 || isNewBooking) {
            if (body) body.classList.add('overflow-hidden')
            if (header) header.style.filter = 'blur(10px)'
        } else {
            if (body) body.classList.remove('overflow-hidden')
            if (header) header.style.filter = 'unset'
        }

        if (selected !== -1) {
            setData(bookings[selected])
            setBookingSelected(bookings[selected])
            setDate(bookings[selected].date || null)
            setSelectedDates(bookings[selected].dateObjects ? JSON.parse(bookings[selected].dateObjects || '').map((date: string) => new Date(date)) : [])
            setQuantity(`${bookings[selected].realQty} ${bookings[selected].realQty === 1 ? 'sesión' : 'sesiones'}`)
            setIsPaid(bookings[selected].isPaid ? 'Si' : 'No')
        }
        modalBehaviour()
    }, [selected])

    useEffect(() => {
        if (dbServiceSelected !== -1) {
            const _serviceData = dbServices[dbServiceSelected]
            setSelectedDays(_serviceData.day ? _serviceData.day.split(',') : [])
            setServiceData(_serviceData)
        }
    }, [dbServiceSelected])

    useEffect(() => {
        if (eventSelected !== -1) {
            setEventData(events[eventSelected])
            setDate(JSON.parse(events[eventSelected].date || 'null'))
            setEndTime(JSON.parse(events[eventSelected].endTime || 'null'))
        }
    }, [eventSelected])

    useEffect(() => {
        if (isNewBooking) {
            setTotalPrice(getPrice())
            setSelectedDates([])
            setDate(null)
            modalBehaviour()
            setEventClicked({})
        }
    }, [bookingSelected, quantity])

    useEffect(() => {
        if (isNewBooking) {
            setData(bookingSelected)
            setQuantity('1 sesión')
        }
    }, [bookingSelected])

    useEffect(() => {
        setOpenCalendar(false)
    }, [date])

    useEffect(() => {
        setOpenCalendars({})
    }, [selectedDates])

    useEffect(() => {
        localStorage.setItem('bookingView', view)
        discardChanges()
    }, [view])

    const verifyUser = async () => {
        try {
            const isLodded = await verifyToken()
            if (!isLodded || !isLodded.token) {
                setIsLoggedIn(false)
                localStorage.clear()
                history.push('/')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getServices = async () => {
        try {
            const allServices = await getAllServices()
            if (allServices && allServices.length) setDbServices(allServices)
        } catch (err) {
            console.error(err)
        }
    }

    const getEvents = async () => {
        try {
            const allEvents = await getAllEvents()
            if (allEvents && allEvents.length) setEvents(allEvents)
        } catch (err) {
            console.error(err)
        }
    }

    const modalBehaviour = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setOpenCalendar(false)
                setOpenCalendars({})
            }
        })
    }

    const getBookings = async () => {
        setLoading(true)
        try {
            const _bookings = await getAllBookings()
            if (_bookings && Array.isArray(_bookings)) setBookings(_bookings)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const updateData = (key: string, e: { [key: string | number]: any }) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const updateServiceData = (key: string, e: { [key: string | number]: any }) => {
        const value = e.target.value
        setServiceData({ ...serviceData, [key]: value })
    }

    const updateEventData = (key: string, e: { [key: string | number]: any }) => {
        const value = e.target.value
        setEventData({ ...eventData, [key]: value })
    }

    const discardService = () => {
        setDbServiceSelected(-1)
        setSelectedDays([])
        setServiceData(voidServiceData)
        setIsNewService(false)
        setTryToRemoveService(false)
    }

    const discardChanges = () => {
        setData(voidData)
        setSelected(-1)
        setTryToRemove(false)
        setIsNewBooking(false)
        setQuantity('1 sesión')
        setTotalPrice(0)
        setIsPaid('')
        setDiscount('')

        setOpenCalendar(false)
        setOpenCalendars({ ...{} })
        setDate(null)
        setSelectedDates([])
        setBookingSelected({ ...{} })
        setEventClicked({ ...{} })



        setEventSelected(-1)
        setIsNewEvent(false)
        setTryToRemoveEvent(false)
        setEventData(voidEvent)
        setEndTime(null)
    }

    const saveChanges = async () => {
        setLoading(true)
        try {
            const bookingData: any = {
                ...data,
                serviceId: isNewBooking ? bookingSelected._id : data.serviceId,
                date: JSON.stringify(date),
                dateObjects: JSON.stringify(selectedDates),
                name: getServiceData('name'),
                realQty: getQuantity(),
                realPrice: getPrice(),
                priceInCents: Number(String(getPrice()).replace('.', '')),
                image: getImage(),
                isPaid: isPaid === 'Si' ? true : false,
                sendEmail
            }
            if (isNewBooking) delete bookingData._id

            const saved = isNewBooking ? await createBooking(bookingData) : await updateBooking(bookingData)

            if (saved && saved.name) {
                toast.success('Cambios guardados')
                discardChanges()
                setLoading(false)
                return getBookings()
            }
            toast.error('Ocurrió un error al guardar')
            setLoading(false)
        } catch (err) {
            toast.error('Ocurrió un error al guardar')
            console.error(err)
            setLoading(false)
        }
    }

    const getImage = () => {
        return bookingSelected.image || data.image || 'https://i.postimg.cc/rwHVQg5k/angelita-logo.png'
    }

    const removeBooking = async () => {
        setLoading(true)
        try {
            const updated = await deleteBooking(data)
            if (updated) {
                toast.success('Reserva eliminada')
                discardChanges()
                setLoading(false)
                return getBookings()
            }
            toast.error('Ocurrió un error al guardar los cambios')
            setLoading(false)
        } catch (err) {
            toast.error('Ocurrió un error al guardar los cambios')
            console.error(err)
            setLoading(false)
        }
    }

    const getQuantityOptions = () => {
        return Array.from({ length: 20 })
            .map((_, i) => i === 0 ?
                `${i + 1} sesión (${getHours(i + 1)})` :
                `${i + 1} sesiones (${getHours(i + 1)}) ${discount}`)
    }

    const getHours = (session: number) => {
        return getServiceData('duration') * session > 1 ?
            `${getServiceData('duration') * session} horas` :
            `${session} hora`
    }

    const getServiceData = (data: string | number) => {
        return (bookingServiceSelected as dataObj)[data]
    }

    const getPrice = () => {
        if (bookingSelected.price) {
            const { price } = bookingSelected
            const hours = getQuantity()
            return parseFloat((price * hours).toFixed(2))
        }
        return 0
    }

    const getQuantity = () => {
        return Number(quantity.split(' ')[0]) || 1
    }

    const tileDisabled: TileDisabledFunc = ({ activeStartDate, date, view }): boolean => {
        const day = date.getDay()
        const today = new Date()
        const isTodayOrBefore = date <= today
        const serviceDays = (getServiceData('day') || '').toLowerCase()
        let disabled = [0, 1, 2, 3, 4, 5, 6]
        weekDays.map((weekday: string, i) => {
            if (serviceDays.includes(weekday.toLowerCase())) disabled = disabled.filter(n => n !== i)
        })
        if (serviceDays) return disabled.includes(day) || isTodayOrBefore
        return false
    }

    const getDate = (date: Date) => {
        return Array.isArray(date) ?
            date.map((d: Date) => new Date(d).toLocaleDateString("es-ES")).join(', ') :
            new Date(date).toLocaleDateString("es-ES")
    }

    const handleDateChange = (value: any, index: number): void => {
        if (value instanceof Date) {
            const updatedDates = [...selectedDates]
            const mapDates = updatedDates.map(date => new Date(date).toLocaleDateString())
            const dateVal = new Date(value).toLocaleDateString()

            if (!mapDates.includes(dateVal) || mapDates.indexOf(dateVal) === index) updatedDates[index] = value
            setSelectedDates(updatedDates)
        }
    }

    const getBookingSlots = (date: Date, start: number | null = null, end: number | null = null) => {
        const timeSlots = []
        const unavailableTime = getBookedSlots(bookings, true)
        const startTime = new Date(date)
        const endTime = new Date(date)
        startTime.setHours(start || data.startTime || 9, 0, 0, 0)
        endTime.setHours(end || data.endTime || 18, 0, 0, 0)
        const step = 60 * 60 * 1000

        for (let currentTime = startTime; currentTime <= endTime; currentTime.setTime(currentTime.getTime() + step)) {
            const freeSlot = new Date(currentTime)
            if (!unavailableTime.includes(freeSlot.getTime())) timeSlots.push(freeSlot)
        }
        return timeSlots
    }

    const getBookedSlots = (bookingArray: any[], miliseconds = false) => {
        let slots: any[] = []
        bookingArray.forEach((booking: any) => {
            if (booking.dateObjects) {
                const dateObjs = JSON.parse(booking.dateObjects || '[]')
                dateObjs.forEach((date: any) => {
                    slots.push(miliseconds ? new Date(date).getTime() : new Date(date))
                })
            }
            else if (booking.date) slots.push(miliseconds ? new Date(booking.date).getTime() : new Date(booking.date))
        })
        return slots
    }

    const localTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getCalendarEvents = () => {
        try {
            let bookingEvents: any[] & any[] = []
            bookings.forEach(booking => {
                if (booking.dateObjects) {
                    const dateObjs = JSON.parse(booking.dateObjects || '[]')
                    dateObjs.forEach((date: any) => {
                        bookingEvents.push({
                            ...booking,
                            id: booking._id,
                            title: `${booking.service} - ${booking.fullname}`,
                            start: moment(date).toDate(),
                            end: moment(date).add(booking.duration || 1, 'hours').toDate()
                        })
                    })
                } else if (booking.date) {
                    bookingEvents.push({
                        ...booking,
                        id: booking._id,
                        title: `${booking.service} - ${booking.fullname}`,
                        start: moment(booking.date).toDate(),
                        end: moment(booking.date).add(booking.duration || 1, 'hours').toDate()
                    })
                }
            })
            return bookingEvents
        } catch (error) {
            console.error(error)
            return []
        }
    }

    const localizer = momentLocalizer(moment);

    const handleSelectSlot = (event: any) => {
        const { start, end } = event
        setDate(start)
        setIsNewBooking(true)
    }

    const handleSelectEvent = (event: any) => {
        const { _id } = event
        setSelected(bookings.findIndex((item) => item._id === _id))
        setEventClicked(event)
    }

    const messages = {
        allDay: 'Todo el día',
        previous: '◄ Anterior',
        next: 'Siguiente ►',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango',
    }

    const saveServiceData = async () => {
        try {
            setLoading(true)
            const _serviceData = { ...serviceData }
            if (selectedDays.length) _serviceData.day = selectedDays.join(', ')

            const saved = isNewService ? await createService(_serviceData) : await updateService(_serviceData)
            if (saved && saved._id) {
                toast.success('Servicio guardado')
                discardService()
                getServices()
            } else toast.error('Ocurrió un error al guardar, intenta nuevamente')
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const saveEventData = async (duplicate: boolean = false) => {
        try {
            setLoading(true)
            const event: any = {
                ...eventData,
                date: JSON.stringify(date),
                endTime: JSON.stringify(endTime),
                duration: getDuration(date, endTime),
            }
            if (duplicate) {
                delete event['_id']
                event.name = `${event.name} (copia)`
            }

            const saved = isNewEvent || duplicate ? await createEvent(event) : await updateEvent(event)

            if (saved && saved._id) {
                toast.success('Evento guardado')
                discardChanges()
                getEvents()
            } else toast.error('Ocurrió un error al guardar, intenta nuevamente')
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const removeService = async () => {
        setLoading(true)
        try {
            const updated = await deleteService(serviceData)
            if (updated) {
                toast.success('Servicio eliminado')
                discardService()
                setLoading(false)
                return getServices()
            }
            toast.error('Ocurrió un error al guardar los cambios')
            setLoading(false)
        } catch (err) {
            toast.error('Ocurrió un error al guardar los cambios')
            console.error(err)
            setLoading(false)
        }
    }

    const removeEvent = async () => {
        setLoading(true)
        try {
            const updated = await deleteEvent(eventData)
            if (updated) {
                toast.success('Evento eliminado')
                discardChanges()
                setLoading(false)
                return getEvents()
            }
            toast.error('Ocurrió un error al guardar los cambios')
            setLoading(false)
        } catch (err) {
            toast.error('Ocurrió un error al guardar los cambios')
            console.error(err)
            setLoading(false)
        }
    }

    const getDuration = (start: any, end: any) => {
        if (start && end) return new Date(end).getHours() - new Date(start).getHours()
        return 0
    }

    const handleCreateButton = () => {
        discardChanges()
        discardService()
        setServiceData({ name: '' })
        if (view === 'Servicios') return setIsNewService(true)
        if (view === 'Eventos') return setIsNewEvent(true)
        setIsNewBooking(true)
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

    const renderModal = () => {
        return (
            <div className='home__modal-wrapper'>
                <div className='home__modal-container' style={{ overflow: 'auto ' }}>
                    <h4 className="home__modal-close" onClick={discardChanges}>X</h4>
                    <div className="booking__row">
                        {isNewBooking && !data.service && !data.fullname ?
                            <h1 className='booking__title'>Nueva reserva</h1>
                            :
                            <h1 className='booking__title'>{bookingServiceSelected.name} - {data.fullname}{bookingSelected._id ? ' (ID: ' + bookingSelected._id.substring(18) + ')' : ''}</h1>}
                    </div>
                    {tryToRemove ?
                        <div className="booking__col" style={{ width: '100%' }}>
                            <h3 style={{ textAlign: 'center', fontWeight: 'normal', fontSize: '1.5rem' }}>¿Estás segura de que quieres eliminar esta reserva?</h3>
                            <div className="booking__row">
                                <div className="booking__col">
                                    <div className="booking__no-edit-data">
                                        <h2 className="booking__data-label">Reserva</h2>
                                        <h2 className="booking__data-value">{selectedDates.length ? selectedDates.map((date: Date) => parseDateTime(date)).join(', ') : parseDateTime(date)}</h2>
                                    </div>
                                </div>
                                <div className="booking__col">
                                    <div className="booking__no-edit-data">
                                        <h2 className="booking__data-label">Total</h2>
                                        <h2 className="booking__data-value">{bookingSelected.currency || 'USD'} ${bookingSelected.realPrice}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="booking__btns">
                                <Button
                                    label='Cancelar'
                                    handleClick={discardChanges}
                                    bgColor="lightgray"
                                />
                                <Button
                                    label='Eliminar'
                                    handleClick={removeBooking}
                                    bgColor="#ffacac"
                                />
                            </div>
                        </div>
                        :
                        <div className="booking__row">
                            <div className="booking__col">
                                {isNewBooking ?
                                    <Dropdown
                                        label='Servicio'
                                        options={dbServices}
                                        selected={bookingServiceSelected}
                                        setSelected={setBookingServiceSelected}
                                        value={bookingServiceSelected.name}
                                        objKey='name'
                                    />
                                    :
                                    <div className="booking__data">
                                        <h2 className="booking__data-label">Servicio</h2>
                                        <h2 className="booking__data-value">{data.name}</h2>
                                    </div>}
                                <div className="booking__no-edit-data">
                                    <h2 className="booking__data-label">Precio unitario</h2>
                                    <h2 className="booking__data-value">{parsePrice(data.price)}</h2>
                                </div>
                                <InputField
                                    label='Nombre completo'
                                    name="fullname"
                                    updateData={updateData}
                                    value={data.fullname || ''}
                                />
                                <InputField
                                    label='País de residencia'
                                    name="country"
                                    updateData={updateData}
                                    value={data.country || ''}
                                />
                                <Dropdown
                                    label='Cantidad'
                                    options={getQuantityOptions()}
                                    setSelected={setQuantity}
                                    selected={quantity}
                                    value={quantity}
                                />
                                <div className="payment__contact-info-row">
                                    {openCalendar ?
                                        <Calendar
                                            locale='es'
                                            onChange={setDate}
                                            value={date}
                                            tileDisabled={tileDisabled}
                                            className='react-calendar calendar-fixed'
                                        />
                                        : getQuantity() === 1 ?
                                            <>
                                                <Button
                                                    label={date ? getDate(date) : 'Seleccionar fecha'}
                                                    handleClick={() => setOpenCalendar(true)}
                                                    bgColor="#B0BCEB"
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                {data.startTime ?
                                                    <Dropdown
                                                        label='Seleccionar hora'
                                                        options={getBookingSlots(date)}
                                                        selected={date}
                                                        setSelected={setDate}
                                                        value={date}
                                                        isTime={true}
                                                        maxHeight='10rem'
                                                    />
                                                    : ''}
                                            </>
                                            : ''
                                    }
                                </div>
                                <div className="payment__various-dates">
                                    {Number(quantity.split(' ')[0]) > 1 ?
                                        Array.from({ length: getQuantity() }).map((_, i) =>
                                            <div
                                                key={i}
                                                className="payment__various-dates-item"
                                                style={{
                                                    width: '100%',
                                                    border: eventClicked.start && getDate(eventClicked.start) === getDate(selectedDates[i]) ? '2px solid #EBAA59' : ''
                                                }}
                                            >
                                                <h4 className="payment__various-dates-item-label">{i + 1}</h4>
                                                {openCalendars[i] ?
                                                    <Calendar
                                                        locale='es'
                                                        onChange={(date) => handleDateChange(date, i)}
                                                        value={selectedDates[i]}
                                                        tileDisabled={tileDisabled}
                                                        className='react-calendar calendar-fixed'
                                                    />
                                                    :
                                                    <>
                                                        <Button
                                                            label={selectedDates[i] ? getDate(selectedDates[i]) : 'Seleccionar fecha'}
                                                            handleClick={() => setOpenCalendars({ ...openCalendars, [i]: true })}
                                                            bgColor="#B0BCEB"
                                                            style={{ width: 'fit-content' }}
                                                        />
                                                        {data.startTime ?
                                                            <Dropdown
                                                                label='Seleccionar hora'
                                                                options={getBookingSlots(selectedDates[i])}
                                                                selected={selectedDates[i]}
                                                                setSelected={(date: any) => handleDateChange(date, i)}
                                                                value={selectedDates[i]}
                                                                isTime={true}
                                                                maxHeight='10rem'
                                                            />
                                                            :
                                                            <h2 className="booking__data-value">{data.time}</h2>
                                                        }
                                                    </>
                                                }
                                            </div>)
                                        : ''}
                                </div>
                            </div>
                            <div className="booking__col">
                                <div className="booking__no-edit-data">
                                    <h2 className="booking__data-label">Agenda</h2>
                                    <h2 className="booking__data-value">{data.day} - {data.time}</h2>
                                </div>
                                <Dropdown
                                    label='Pago confirmado'
                                    options={['Si', 'No']}
                                    selected={isPaid}
                                    setSelected={setIsPaid}
                                    value={isPaid}
                                />
                                <InputField
                                    label='Correo electrónico'
                                    name="email"
                                    updateData={updateData}
                                    value={data.email || ''}
                                />
                                <InputField
                                    label='Teléfono'
                                    name="phone"
                                    updateData={updateData}
                                    value={data.phone || ''}
                                />
                                <div className="booking__no-edit-data">
                                    <h2 className="booking__data-label">{isNewBooking ? 'Precio final' : data.isPaid ? 'Monto registrado' : 'Monto total'}</h2>
                                    <h2 className="booking__data-value">{isNewBooking ? parsePrice(totalPrice) : parsePrice(data.price)}</h2>
                                </div>
                                {!isNewBooking ?
                                    <Switch
                                        label='Enviar email con cambios'
                                        on='Si'
                                        off='No'
                                        value={sendEmail}
                                        setValue={setSendEmail}
                                    />
                                    : ''}
                            </div>
                        </div>
                    }
                    {!tryToRemove ?
                        <div className="booking__btns">
                            {!isNewBooking ?
                                <Button
                                    label='Eliminar reserva'
                                    handleClick={() => setTryToRemove(true)}
                                    bgColor="#ffacac"
                                /> : ''}
                            <Button
                                label='Descartar cambios'
                                handleClick={discardChanges}
                                bgColor="lightgray"
                            />
                            <Button
                                label={isNewBooking ? 'Crear' : 'Guardar'}
                                handleClick={saveChanges}
                                disabled={loading}
                                bgColor='#87d18d'
                            />
                        </div>
                        : ''}
                </div >
            </div >
        )
    }

    const renderServiceSidebar = () => {
        return (
            <div className={`booking__sidebar-event ${dbServiceSelected !== -1 || isNewService ? 'show-sidebar' : 'hide-sidebar'}`}>
                <h4 className="booking__sidebar-title">{tryToRemoveService ? serviceData.name : 'Detalles del servicio'}</h4>
                {tryToRemoveService ?
                    <div className="booking__sidebar-col">
                        <h3 style={{ textAlign: 'center', fontWeight: 'normal', fontSize: '1rem' }}>¿Estás segura de que quieres eliminar este servicio?</h3>
                        <div className="booking__btns">
                            <Button
                                label='Cancelar'
                                handleClick={discardChanges}
                                bgColor="lightgray"
                            />
                            <Button
                                label='Eliminar'
                                handleClick={removeService}
                                bgColor="#ffacac"
                            />
                        </div>
                    </div>
                    :
                    <div className="booking__sidebar-col">
                        <InputField
                            label='Nombre'
                            name="name"
                            updateData={updateServiceData}
                            value={serviceData.name}
                        />
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Título'
                                name="title"
                                updateData={updateServiceData}
                                value={serviceData.title}
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Descripción'
                                name="description"
                                updateData={updateServiceData}
                                value={serviceData.description}
                                type='textarea'
                                rows={5}
                                resize='vertical'
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <Dropdown
                                label='Días'
                                options={weekDays}
                                selected={selectedDays}
                                setSelected={setSelectedDays}
                                value={selectedDays}
                                multiselect
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <Dropdown
                                label='Bookeable desde'
                                options={getTimeOptions()}
                                selected={data.startTime}
                                value={data.startTime ? new Date(data.startTime).toLocaleString('es-ES', timeOptions) : 'Seleccionar'}
                                setSelected={(item: dataObj) => setData({ ...data, startTime: item.value })}
                                objKey='label'
                                style={{ width: '28%' }}
                                maxHeight='20vh'
                            />
                            <Dropdown
                                label='Bookeable hasta'
                                options={getTimeOptions()}
                                selected={data.endTime}
                                value={data.endTime ? new Date(data.endTime).toLocaleString('es-ES', timeOptions) : 'Seleccionar'}
                                setSelected={(item: dataObj) => setData({ ...data, endTime: item.value })}
                                objKey='label'
                                style={{ width: '28%' }}
                                maxHeight='20vh'
                            />
                            <InputField
                                label='Precio'
                                name="price"
                                updateData={updateServiceData}
                                value={serviceData.price || ''}
                                type='number'
                                style={{ width: '20%' }}
                            />
                            <Dropdown
                                label='Es evento'
                                options={['Si', 'No']}
                                selected={serviceData.isEvent || false}
                                setSelected={value => setServiceData({ ...serviceData, 'isEvent': value === 'Si' ? true : false })}
                                value={serviceData.isEvent ? 'Si' : 'No'}
                                style={{ width: '20%' }}
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Imagen (url)'
                                name="image"
                                updateData={updateServiceData}
                                value={serviceData.image || ''}
                                placeholder='https://url-de-imagen.png'
                            />
                            {serviceData.image ?
                                <img src={serviceData.image || ''} className='booking__sidebar-event-image' alt='Imagen del servicio' />
                                : ''}
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Link de reunión (opcionals)'
                                name="link"
                                updateData={updateServiceData}
                                value={serviceData.link || ''}
                                placeholder='https://url-de-reunion'
                            />
                            <InputField
                                label='Contraseña (opcional)'
                                name="linkPassword"
                                updateData={updateServiceData}
                                value={serviceData.linkPassword || ''}
                            />
                        </div>
                    </div>
                }
                {!tryToRemoveService ?
                    <div className="booking__sidebar-btns">
                        <Button
                            label='Cerrar'
                            handleClick={discardService}
                            disabled={loading}
                            bgColor='lightgray'
                        />
                        {!isNewService && dbServiceSelected !== -1 ?
                            <Button
                                label='Eliminar'
                                handleClick={() => setTryToRemoveService(true)}
                                disabled={loading}
                                bgColor='#ffacac'
                            /> : ''}
                        <Button
                            label='Guardar'
                            handleClick={saveServiceData}
                            disabled={loading}
                            bgColor='#87d18d'
                        />
                    </div>
                    : ''
                }
            </div >
        )
    }

    const renderEventSidebar = () => {
        return (
            <div className={`booking__sidebar-event ${eventSelected !== -1 || isNewEvent ? 'show-sidebar' : 'hide-sidebar'}`}>
                <h4 className="booking__sidebar-title">{tryToRemoveEvent ? eventData.name : 'Detalles del evento'}</h4>
                {tryToRemoveEvent ?
                    <div className="booking__sidebar-col">
                        <h3 style={{ textAlign: 'center', fontWeight: 'normal', fontSize: '1rem' }}>¿Estás segura de que quieres eliminar este evento?</h3>
                        <div className="booking__btns">
                            <Button
                                label='Cancelar'
                                handleClick={discardChanges}
                                bgColor="lightgray"
                            />
                            <Button
                                label='Eliminar'
                                handleClick={removeEvent}
                                bgColor="#ffacac"
                            />
                        </div>
                    </div>
                    :
                    <div className="booking__sidebar-col">
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Nombre'
                                name="name"
                                updateData={updateEventData}
                                value={eventData.name || ''}
                            />
                            <Dropdown
                                label='Servicio'
                                options={dbServices.filter(service => service.isEvent)}
                                selected={dbServices.find(service => service._id === eventData.serviceId) || ''}
                                setSelected={value => setEventData({ ...eventData, 'serviceId': value })}
                                value={eventData.service ? eventData.service.name : ''}
                                objKey='name'
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            {openCalendar ?
                                <Calendar
                                    locale='es'
                                    onChange={setDate}
                                    value={date}
                                    tileDisabled={tileDisabled}
                                    className='react-calendar'
                                />
                                : ''}
                            <Button
                                label={date ? getDate(date) : 'Seleccionar fecha'}
                                handleClick={() => setOpenCalendar(true)}
                                bgColor="#B0BCEB"
                                style={{ marginTop: '1rem' }}
                            />
                            <Dropdown
                                label='Hora de inicio'
                                options={getBookingSlots(date, 7, 21)}
                                selected={date}
                                setSelected={setDate}
                                value={date}
                                isTime={true}
                                maxHeight='10rem'
                            />
                            <Dropdown
                                label='Hora de finalización'
                                options={getBookingSlots(date, 7, 21)}
                                selected={endTime || date}
                                setSelected={setEndTime}
                                value={endTime || date}
                                isTime={true}
                                maxHeight='10rem'
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Descripción'
                                name="description"
                                updateData={updateEventData}
                                value={eventData.description || ''}
                                type='textarea'
                                rows={5}
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Imagen (url)'
                                name="image"
                                updateData={updateEventData}
                                value={eventData.image || ''}
                                placeholder='https://url-de-imagen.png'
                            />
                            {eventData.image ?
                                <img src={eventData.image} className='booking__sidebar-event-image' alt='Imagen del Evento' />
                                : ''}
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <InputField
                                label='Precio (US $)'
                                name="price"
                                updateData={updateEventData}
                                value={eventData.price || ''}
                                type='number'
                                style={{ width: '20%' }}
                            />
                            <Dropdown
                                label='Máxima asistencia'
                                options={Array.from({ length: 100 }).map((_, i) => i === 0 ? 'Sin tope' : String(i + 1))}
                                selected={eventData.maxPax || '1'}
                                setSelected={value => setEventData({ ...eventData, 'maxPax': value })}
                                value={eventData.maxPax || 'Sin tope'}
                            />
                        </div>
                        <div className='booking__sidebar-event-row'>
                            <Dropdown
                                label='Es virtual'
                                options={['Si', 'No']}
                                selected={eventData.isVirtual}
                                setSelected={value => setEventData({ ...eventData, 'isVirtual': value ? true : false })}
                                value={eventData.isVirtual === false ? 'No' : 'Si'}
                            />
                            <InputField
                                label='Link'
                                name="link"
                                updateData={updateEventData}
                                value={eventData.link || ''}
                                placeholder='https://url-de-reunion'
                            />
                            <InputField
                                label='Contraseña (opcional)'
                                name="linkPassword"
                                updateData={updateEventData}
                                value={eventData.linkPassword || ''}
                            />
                        </div>
                    </div>
                }
                {!tryToRemoveEvent ?
                    <div className="booking__sidebar-event-btns">
                        <Button
                            label='Cerrar'
                            handleClick={discardChanges}
                            bgColor='lightgray'
                            disabled={loading}
                        />
                        {!isNewEvent && eventSelected !== -1 ?
                            <Button
                                label='Eliminar'
                                handleClick={() => setTryToRemoveEvent(true)}
                                disabled={loading}
                                bgColor='#ffacac'
                            /> : ''}
                        {!isNewEvent && eventSelected !== -1 ?
                            <Button
                                label='Duplicar'
                                handleClick={() => saveEventData(true)}
                                disabled={loading}
                                bgColor='#B0BCEB'
                            /> : ''}
                        <Button
                            label='Guardar'
                            handleClick={() => saveEventData(false)}
                            disabled={loading}
                            bgColor='#87d18d'
                        />
                    </div>
                    : ''
                }
            </div >
        )
    }

    return <div className="booking__container">
        <h1 className='page__title' style={{ margin: 0, filter: selected !== -1 || isNewBooking ? 'blur(10px)' : '' }}>Bookings</h1>
        <div className="booking__cta-btns">
            <Dropdown
                label='Vista'
                options={['Calendario', 'Reservas', 'Servicios', 'Eventos']}
                selected={view}
                setSelected={setView}
                value={view}
                style={{
                    width: 'fit-content',
                    alignSelf: 'flex-end',
                    filter: selected !== -1 || isNewBooking ? 'blur(10px)' : ''
                }}
            />

            <Button
                label={view === 'Servicios' ? 'Crear servicio' : view === 'Eventos' ? 'Nuevo evento' : 'Nueva reserva'}
                handleClick={handleCreateButton}
                bgColor="#87d18d"
                style={{
                    width: '30%',
                    alignSelf: 'flex-end',
                    filter: selected !== -1 || isNewBooking ? 'blur(10px)' : ''
                }}
            />
        </div>

        {view === 'Calendario' ?
            <EventCalendar
                localizer={localizer}
                events={getCalendarEvents()}
                startAccessor="start"
                endAccessor="end"
                defaultDate={new Date()}
                views={["day", "agenda", "week", "month"]}
                selectable
                defaultView="month"
                style={{
                    height: "70vh",
                    width: '60vw',
                    // alignSelf: 'flex-start',
                    zIndex: 0,
                    filter: selected !== -1 || isNewBooking ? 'blur(10px)' : '',
                    marginBottom: '5rem'
                }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 21, 0, 0)}
                messages={messages}
            />
            : view === 'Reservas' ?
                <div style={{ width: '100%', filter: selected !== -1 || isNewBooking ? 'blur(10px)' : '' }}>
                    <DataTable
                        title='Todas las reservas'
                        name='reservas'
                        tableData={bookings}
                        setTableData={setBookings}
                        tableHeaders={bookingHeaders}
                        selected={selected}
                        setSelected={setSelected}
                        loading={loading}
                    />
                </div>
                : view === 'Servicios' ?
                    <div style={{ width: '100%' }}>
                        <p style={{ margin: '0 0 1rem 0' }}>
                            Los servicios mostrados aquí son todos los ofrecidos por ti. Si modificas, creas o eliminas alguno, las reservas que ya estén confirmadas no serán afectadas, sólo las nuevas reservas mostrarán dichas modificaciones.
                        </p>
                        <DataTable
                            title='Todas los servicios'
                            name='servicios'
                            tableData={dbServices}
                            setTableData={setDbServices}
                            tableHeaders={serviceHeaders}
                            selected={dbServiceSelected}
                            setSelected={setDbServiceSelected}
                            loading={loading}
                        />
                    </div>
                    : view === 'Eventos' ?
                        <div style={{ width: '100%' }}>
                            <p style={{ margin: '0 0 1rem 0' }}>
                            </p>
                            <DataTable
                                title='Todas los eventos'
                                name='eventos'
                                tableData={events}
                                setTableData={setEvents}
                                tableHeaders={eventHeaders}
                                selected={eventSelected}
                                setSelected={setEventSelected}
                                loading={loading}
                            />
                        </div>
                        : ''}

        {selected !== -1 || isNewBooking ? renderModal() : ''}
        {renderServiceSidebar()}
        {renderEventSidebar()}

    </div>
}