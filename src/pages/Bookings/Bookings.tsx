import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { bookingHeaders } from '../../constants'
import { getAllBookings } from '../../services'

type Props = {}

export default function Bookings({ }: Props) {
    const [allBookings, setAllBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getBookings()
    }, [])

    const getBookings = async () => {
        try {
            setLoading(true)
            const bookings = await getAllBookings()
            if (bookings && Array.isArray(bookings)) setAllBookings(bookings)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    return (
        <div className="page__row">
            <div className="page__col" style={{ width: '90vw', textAlign: 'center' }}>
                <h1 className="page__title">Bookings</h1>
                <DataTable
                    tableData={allBookings}
                    tableHeaders={bookingHeaders}
                    loading={loading}
                    name='bookings'
                />
            </div>
        </div>
    )
}