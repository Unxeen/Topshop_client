import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import './ProductManage.css'
import { DataGrid } from '@mui/x-data-grid'
// import {GridColDef } from '@mui/x-data-grid'
import { ProductService } from '../Services/ProductService'
import { useUser } from '../Context/UserContext'
import { Box, Button, Chip, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar, Typography } from '@mui/material'
import { ImagePlaceholder } from '../../assets/icons'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Footer from '../Footer/Footer'
import Input from '../Inputs/Input'
import ValdidateMaxLength from '../Validation/ValdidateMaxLength'
import { FormProvider, useForm } from 'react-hook-form'
import { CategoryService } from '../Services/CategoryService'
import { AnimatePresence, motion } from 'framer-motion'
import { Opacity } from '@mui/icons-material'
import { useCart } from '../Context/CartContext'



export default function ProductManage() {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [productsTableRows, setProductsTableRows] = useState([])
    const [user, setUser] = useUser()
    const [cart, setCart] = useCart()
    const [editInitials, setEditInitials] = useState({})
    const [open, setOpen] = useState(false)
    const [pid, setPid] = useState(null)
    const [message, setMessage] = useState(null)
    const formMethods = useForm()
    const setValue = formMethods.setValue


    const priceFormatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })


    // SAVE CHANGES FUNCTION
    const saveEditChanges = formMethods.handleSubmit(
        values => {
            ProductService.updateProduct(
                pid, 
                values.label, 
                values.description, 
                values.price, 
                values.stock, 
                values.cat
            )
            .then(
                axRes => {

                    const success = (
                        <AnimatePresence>
                            <motion.div 
                            initial={{opacity: 1}} 
                            animate={{opacity: 0}}
                            transition={{duration: 3}}
                            onAnimationComplete={(d) => setMessage(null)}
                            >
                                <Typography mr={'2rem'} variant='h5' color={'red'}>
                                    Update success
                                </Typography>
                            </motion.div>
                        </AnimatePresence>
                    )
                    setMessage(success)

                    const product = axRes.data

                    setEditInitials(product)

                    setValue("label", product.label)
                    setValue("cat", product.category.name)
                    setValue("price", product.price)
                    setValue("stock", product.stock)
                    setValue("description", product.description)
                    
                    fetchAllProducts()
                
                }
            )
            .catch(
                axErr => {
                    const error = (
                        <AnimatePresence>
                            <motion.div 
                            initial={{opacity: 1}} 
                            animate={{opacity: 0, transition: 5}}
                            >
                                <Typography mr={'2rem'} variant='h5' color={'red'}>
                                    Update failed
                                </Typography>
                            </motion.div>
                        </AnimatePresence>
                    )
                    setMessage(error)
                    console.log(axErr.response.data.details)
                }
            )
        }
    )



// :GridColDef<any>[]
    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 80
        },
        {
            field: "image",
            headerName: "PRODUCT IMAGE",
            width: 180,
            cellClassName: "image_table_cell",
            headerClassName: "image_table_header",
            headerAlign: 'left',
            renderCell: param => {
                if (param.value) {
                    return (
                        <img
                        className="products_table_image"
                        src={`data:image/png;base64,${param.value.imageData}`} alt="" />
                    ) 
                }
                return ImagePlaceholder
            }
        },
        {
            field: "label",
            headerName: "PRODUCT LABEL",
            width: 300
        },
        {
            field: "category",
            headerName: "Category",
            width: 130
        },
        {
            field: "price",
            headerName: "PRICE",
            width: 130,
            type: 'number',
            valueFormatter: v => priceFormatter.format(v)
        },
        {
            field: "stock",
            headerName: "STOCK",
            width: 100,
            type: 'number'
        },
        {
            field: "status",
            headerName: "STATUS",
            type: "text",
            width: 150,
            headerAlign: 'right',
            align: 'right',
            renderCell: param => {
                if (param.value === "IN STOCK") {
                    return <Chip label={param.value} color='success' variant='filled' size='medium'/>   
                }
                return <Chip label={param.value} color='warning' variant='filled' size='medium'/>   
            }
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            resizable: false,
            disableColumnMenu: true,
            hideSortIcons: true,
            align: 'right',
            renderCell: param => (
                <IconButton 
                onClick={(e) => {
                    setPid(param.value)
                    setOpen(true)
                }}>
                    <ModeEditIcon/>
                </IconButton>)
        }
    ]




    function cancelEdit(){
        setPid(0)
        setOpen(false)
        setValue('label', editInitials.label)
        setValue("cat", editInitials.category.name)
        setValue("price", editInitials.price)
        setValue("stock", editInitials.stock)
        setValue("description", editInitials.description)
    }



    function deleteProduct(){

        // const productExist = cart.forEach(
        //     lp => 
        // )

        ProductService.deleteProduct(pid)
        .then(
            axRes => {
                fetchAllProducts()
                ProductService.getCart(user.username)
                .then(
                    axRes => setCart(axRes.data)
                )
                setOpen(false)
            }
        )
        .catch(
            axErr => console.log(axErr.response.data.details)
        )
    }


    function fetchAllProducts(){
        if (user) {
            ProductService.getAllByUsername(user.username)
            .then(
                axRes => {
                    const products = axRes.data
                    setProducts(products)
                    const rows = products.map(
                        p => {
                            const status = p.stock > 0 ? "IN STOCK" : "OUT OF STOCK"
                            return {
                                id: p.id,
                                image: p.image,
                                label: p.label,
                                category: p.category.name,
                                price: p.price,
                                stock: p.stock,
                                status: status,
                                actions: p.id
                            }
                        }
                    )
                    setProductsTableRows(rows)
                }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }
    }






    // UPDATE EDIT INITIALS
    useEffect(() => {
        if(pid){
            ProductService.getProductById(pid)
            .then(
                axRes => {

                    const product = axRes.data

                    setEditInitials(product)

                    setValue("label", product.label)
                    setValue("cat", product.category.name)
                    setValue("price", product.price)
                    setValue("stock", product.stock)
                    setValue("description", product.description)
                }
            )
        }
    }, [pid])




    // INITIALIZING CATEGORIES LIST FROM SERVER
    useEffect(() => {
        CategoryService.getCategories().then(
        axRes => setCategories(axRes.data)
        ).catch(
        axErr => console.log(axErr.response.data.details)
        )
    }, [])    




    // FETCH PRODUCTS
    useEffect(() => {
        fetchAllProducts()
    }, [])



    return (
        <>
            <div className='wrapper-global product_manage_page'>
                <Header/>
                <div className="product_manage_page_topbg">

                </div>
                <div className="product_manage_container">
                    
                    <h1 className='product_manage_title'>Manage Products</h1>
        

                    <div className="product_manage_products_table_container">
                        {
                            products.length > 0 && (
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
                                        bgcolor: 'rgb(23, 30, 90, .1)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    >
                                        Listed Products <span style={{marginLeft: '1rem', color: 'rgb(0,0,0, 0.75)'}}>({products.length})</span>
                                    </Toolbar>

                                    <Collapse className='product_edit_collapse' in={open}>
                                        <Box
                                        width={'100%'}
                                        border={'1px solid rgb(224, 224, 224)'}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'flex-end'}
                                        gap={'1rem'}
                                        py={'1rem'}
                                        px={'2rem'}
                                        >
                                            <FormProvider {...formMethods}>
                                                <Box
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    gap={'33px'}
                                                >
                                                    <div className='product_edit_image_container'>
                                                        <img 
                                                        src="/src/assets/images/ProductPlaceholder-sm-PNG.png" 
                                                        alt="" 
                                                        width={'185px'} 
                                                        height={'185px'} 
                                                        className='product_edit_image'/>

                                                        <IconButton className='product_edit_image_change'>
                                                            <ModeEditIcon 
                                                            htmlColor='darkblue' 
                                                            fontSize='large'/>
                                                        </IconButton>
                                                    </div>
                                                    
                                                    <div className="product_edit_fields">

                                                        <Input
                                                        containerClass={"product_edit_fields_label"}
                                                        inputClass={"product_edit_fields_label_input"}
                                                        id={"product_edit_fields_label"}
                                                        name={"label"}
                                                        label={"Product label"}
                                                        placeholder={"Product label"}
                                                        required={true}
                                                        validation={ValdidateMaxLength}
                                                        type={"text"}
                                                        />

                                                        <Input
                                                        containerClass={"product_edit_fields_price"}
                                                        inputClass={"product_edit_fields_price_input"}
                                                        id={"product_edit_fields_price"}
                                                        name={"price"}
                                                        label={"Price"}
                                                        placeholder={"Price"}
                                                        required={true}
                                                        // validation={ValdidateMaxLength}
                                                        type={"number"}
                                                        />

                                                        <Input
                                                        containerClass={"product_edit_fields_stock"}
                                                        inputClass={"product_edit_fields_stock_input"}
                                                        id={"product_edit_fields_stock"}
                                                        name={"stock"}
                                                        label={"Stock"}
                                                        placeholder={"Stock"}
                                                        required={true}
                                                        // validation={ValdidateMaxLength}
                                                        type={"number"}
                                                        />

                                                        <div className="product_edit_fields_category input_container">

                                                            <label htmlFor="product_listing_category">
                                                                <span className='category_label_text input_text'>Category</span>
                                                                <span className='category_error input_error'>
                                                                {
                                                                formMethods.formState.errors && 
                                                                formMethods.formState.errors.category && 
                                                                formMethods.formState.errors.category.message
                                                                }
                                                                </span>
                                                            </label>

                                                            <select 
                                                            className='product_listing_product_category_input input'
                                                            defaultValue={""}
                                                            {...formMethods.register(
                                                                "cat",
                                                                {
                                                                required: {
                                                                    value: true,
                                                                    message: "Required"
                                                                }
                                                                }
                                                            )}
                                                            >

                                                            <option value={""} disabled>Category...</option>
                                                            {categories && categories.map(
                                                                category => (
                                                                <option key={category.name} value={category.name}>
                                                                    {category.name}
                                                                </option>
                                                                )
                                                            )}

                                                            </select>

                                                        </div>

                                                        <Input
                                                        containerClass={"product_edit_fields_description"}
                                                        inputClass={"product_edit_fields_description_input"}
                                                        id={"product_edit_fields_description"}
                                                        name={"description"}
                                                        label={"Description"}
                                                        placeholder={"Description"}
                                                        required={true}
                                                        // validation={ValdidateMaxLength}
                                                        type={"textarea"}
                                                        />                                    
                                                    </div>
                                                </Box>
                                            </FormProvider>
                                            <Box 
                                            display={'flex'}
                                            alignItems={'center'}
                                            gap={'1rem'}
                                            >
                                                {message && message}

                                                <Button
                                                onClick={saveEditChanges}
                                                size='large' 
                                                variant='contained' 
                                                color='primary'>
                                                    Save
                                                </Button>

                                                <Button
                                                size='large'
                                                variant='contained'
                                                color='warning'
                                                onClick={deleteProduct}                                     
                                                >
                                                    Delete
                                                </Button>

                                                <Button 
                                                size='large' 
                                                variant='outlined' 
                                                color='warning'
                                                onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </Button>

                                            </Box>

                                        </Box>
                                    </Collapse>

                                    <DataGrid
                                    
                                    rowSelection={false}
                                    row
                                    sx={{
                                        fontSize: "1.5rem",
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 4px 0px rgb(0, 0, 0, .1)',
                                        // borderRadius: "10px",
                                        overflow: 'hidden',
                                        borderBottomLeftRadius: '10px',
                                        borderBottomRightRadius: '10px',
                                        borderTopLeftRadius: '0px',
                                        borderTopRightRadius: '0px',
                                        // boxShadow: '0px 1px 4px 0px rgb(0, 0, 0, .15)'
                                    }}
                                    columns={columns}
                                    rows={productsTableRows}
                                    initialState={{
                                        pagination: {
                                        paginationModel: { page: 0, pageSize: 10}
                                        }
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    />          
                                </>
                            )
                        }

                    </div>
                </div>
                
            </div>
            <Footer/>
        </>
    )
}
