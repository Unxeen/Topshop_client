import { LineChart, lineElementClasses } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import Header from '../Header/Header'
import { SalesService } from '../Services/SalesService'
import { useUser } from '../Context/UserContext'
import { DataGrid } from '@mui/x-data-grid'
import { Toolbar } from '@mui/material'
import { format, parse, parseISO,  } from 'date-fns'
import Footer from '../Footer/Footer'

export default function Dashboard() {

  // USER CONTEXT
  const [user, setUser] = useUser()

  // SALES CHART
  const [dailySales, setDailySales] = useState([])
  const [salesWeek, setSalesWeek] = useState([])
  const [allSalesTotal, setAllSalesTotal] = useState(0)

  // QUANTITY SOLD CHART
  const [dailyQuantity, setDailyQuantity] = useState([])
  const [quantityWeek, setQuantityWeek] = useState([])
  const [allSalesCount, setAllSalesCount] = useState(0)

  // VIEWS CHART
  const [dailyViews, setDailyViews] = useState([])
  const [viewsWeek, setViewsWeek] = useState([])
  const [allProductViews, setAllProductViews] = useState(0)

  // SALES TABLE
  const [allSales, setAllSales] = useState([])
  const [salesTableRows, setSalesTableRows] = useState([])

  const valueFormatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })



  // FOR THE SALES TABLE AT THE END
  const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'email', headerName: 'Email Address', width: 250},
    {field: 'item', headerName: 'Item', width: 200},
    {field: 'quantity', headerName: 'Quantity', width: 100},
    {
      field: 'total', 
      headerName: 'Total', 
      width: 100,
      type: 'number',
      valueFormatter: (value) => valueFormatter.format(value)
    },
    {
      field: 'date', 
      headerName: 'Date',
      headerAlign: 'right',
      align: 'right',
      width: 200,
      type: 'date',
      valueGetter: (value) => new Date(value),
      }
  ]



  function fetchAllSales(){
    const username = user ? user.username : "";
    SalesService.getAllSales(username)
    .then(
      axRes => {

        const sales = axRes.data.sales
        const total = axRes.data.total
        const totalQuantity = axRes.data.quantityTotal
        const totalViews = axRes.data.totalViews

        const salesTableArray = sales.reverse().map(
          (sale, index, arr) => {
            return {
              id: index+1,
              email: sale.buyer.email,
              item: sale.product,
              quantity: sale.quantity,
              total: sale.totalPrice,
              date: sale.createdAt
            }
          }
        )

        // console.log(axRes.data.sales.length)
        setSalesTableRows(salesTableArray)
        setAllSales(sales)
        setAllSalesTotal(total)
        setAllSalesCount(totalQuantity)
        setAllProductViews(totalViews)
      }
    )
    .catch(
      axErr => console.log(axErr.response.data.details)
    )
  }




  // FETCH LAST 7 DAYS STATS
  useEffect(() => {
    const username = user ? user.username : ""
    SalesService.getWeeklySales(username)
    .then(
      axRes => {
        // console.log(axRes.data)
        const dailySales = axRes.data.dailySales
        const dailyQuantities = axRes.data.dailySoldCounts
        const dailyViews = axRes.data.dailyViews

        const salesWeek = dailySales.map(
          ds => new Date(ds.date)
        )
        const quantitiesWeek = dailyQuantities.map(
          dc => new Date(dc.date)
        )
        const viewsWeek = dailyViews.map(
          dv => new Date(dv.date)
        )

        // console.log(dailyViews)
        setDailySales(dailySales)
        setDailyQuantity(dailyQuantities)
        setDailyViews(dailyViews)

        setSalesWeek(salesWeek)
        setQuantityWeek(quantitiesWeek)
        setViewsWeek(viewsWeek)
      }
    )
    .catch(
      axErr => console.log(axErr.response.data.details)
    )
  }, [])




  // FECTCH ALL SALES
  useEffect(() => {
    fetchAllSales()
  }, [])




  return (
    <div className='global-wrapper dashboard_page_wrapper'>
      <div className="top_banner"></div>
      <Header
        classNames={'no_bg'}
      />

      <div className="dashboard_container">

        <h1 className='dashboard_title'>Dashboard</h1>

        <div className="dashboard_statistics_container">

          {/* AMOUNT EARNED STATS */}
          {dailySales.length > 0 && (
            <div className="chart_container">
              <h1 className='chart_title'>Total earnings: 
                <span>
                  {allSalesTotal ? valueFormatter.format(allSalesTotal) : 0}
                </span>
              </h1>
              <LineChart
                className='custom_chart'
                sx={{'& .MuiAreaElement-root': {
                  fill: "url(#myGradient)"
                }}}
                xAxis={[{ 
                  dataKey: 'day',
                  valueFormatter: (value, context) => {
                    const matchingDate = salesWeek.find((v, i) => v.getDate() === value)
                    return matchingDate ? format(matchingDate, 'yyyy/MM/dd') : `${value}`
                  }
                }]}
                series={[
                  {
                    dataKey: 'totalSales',
                    valueFormatter: (value, context) => valueFormatter.format(value),
                    area: true,
                    curve: 'linear',
                    color: 'darkblue'
                  },
                ]}
                dataset={dailySales}
                margin={{left: 0, right: 0, top: 120, bottom: 0}}
                // width={312}
                // height={206}
                >

                <defs>
                  <linearGradient id="myGradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="darkblue" stopOpacity={.1} />
                    <stop offset="100%" stopColor="lightblue" stopOpacity={.1}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </div>
          )}




          {/* QUANTITY SOLD STATS */}
          {dailyQuantity.length > 0 && (
            <div className="chart_container">
              <h1 className='chart_title'>Sold items: <span>{allSalesCount ? allSalesCount : 0}</span></h1>
              <LineChart
                className='custom_chart'
                sx={{'& .MuiAreaElement-root': {
                  fill: "url(#myGradient)"
                }}}
                xAxis={[{ 
                  dataKey: 'day',
                  valueFormatter: (value, context) => {
                    const matchingDate = quantityWeek.find((v, i) => v.getDate() === value)
                    return matchingDate ? format(matchingDate, 'yyyy/MM/dd') : `${value}`
                  }
                }]}
                series={[
                  {
                    dataKey: 'soldCount',
                    area: true,
                    curve: 'linear',
                    color: 'darkgreen'
                  },
                ]}
                dataset={dailyQuantity}
                margin={{left: 0, right: 0, top: 120, bottom: 0}}
                // width={312}
                // height={206}
                >

              </LineChart>
            </div>
          )}




          {dailyViews.length > 0 && (
            <div className="chart_container">
              <h1 className='chart_title'>Total views: <span>{allProductViews ? allProductViews : 0}</span></h1>
              <LineChart
                className='custom_chart'
                sx={{'& .MuiAreaElement-root': {
                  fill: "url(#myGradient)"
                }}}
                xAxis={[{ 
                  dataKey: 'day',
                  valueFormatter: (value, context) => {
                    const matchingDate = viewsWeek.find((v, i) => v.getDate() === value)
                    return matchingDate ? format(matchingDate, 'yyyy/MM/dd') : `${value}`
                  }
                  // data: [11, 12]
                }]}
                series={[
                  {
                    dataKey: 'viewsCount',
                    area: true,
                    curve: 'linear',
                    color: 'darkcyan'
                  },
                ]}
                dataset={dailyViews}
                margin={{left: 0, right: 0, top: 120, bottom: 0}}
                // width={312}
                // height={206}
                >

              </LineChart>
            </div>
          )}
        </div>

        <div className="latest_sales_container">
          {allSales.length > 0 &&
          <>
            <Toolbar
              sx={{
                // boxShadow: '0px 1px 4px 0px rgb(0, 0, 0, .15)',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
                fontSize: "2rem",
                border: '1px solid rgb(224, 224, 224)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Sales <span style={{marginLeft: '1rem', color: 'rgb(0,0,0, 0.75)'}}>({allSales.length})</span>
            </Toolbar>
            <DataGrid
              sx={{
                fontSize: "1.5rem",
                // borderRadius: "10px",
                overflow: 'hidden',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                // boxShadow: '0px 1px 4px 0px rgb(0, 0, 0, .15)'
              }}
              columns={columns}
              rows={salesTableRows}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5}
                }
              }}
              pageSizeOptions={[5, 10]}
            />          
          </>
          }
        </div>

      </div>

      <Footer/>
    </div>
  )
}
