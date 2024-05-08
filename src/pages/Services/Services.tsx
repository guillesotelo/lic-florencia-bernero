import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { serviceHeaders } from '../../constants'
import { getAllServices } from '../../services'

type Props = {}

export default function Services({ }: Props) {
    const [allServices, setAllServices] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getServices()
    }, [])

    const getServices = async () => {
        try {
            setLoading(true)
            const services = await getAllServices()
            if (services && Array.isArray(services)) setAllServices(services)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    return (
        <div className="page__row">
            <div className="page__col" style={{ width: '90vw', textAlign: 'center' }}>
                <h1 className="page__title">Services</h1>
                <DataTable
                    tableData={allServices}
                    tableHeaders={serviceHeaders}
                    loading={loading}
                    name='servicios'
                />
            </div>
        </div>
    )
}