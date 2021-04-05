import React from 'react'
import { connect } from 'react-redux'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputBase from '@material-ui/core/InputBase'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import { Number33 } from '../Helpers/general'
import { setDTPaginationTo } from '../Redux/action'
import { Grid } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import './../Assets/scss/pagination.scss'
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: 'Shabnam',
        fontSize: 14,
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase)

class Pagination extends React.Component {
    state = {
        propData: {},
        limit: 10,
        key: this.props.accessibilityKey,
    }

    itemsToShow = 3

    pagination = () => {
        let current_page = this.props.datatable[this.props.accessibilityKey] ? this.props.datatable[this.props.accessibilityKey].current_page : 1
        let pagination = [
            <div
                key="first_page"
                className={'page ' + ('page' + this.state.key + ' ') + (current_page === 1 ? 'active_page' : '')}
                page={1}
                onClick={this.getPage(1)}
            >
                1
            </div>,
        ]
        let totalPage = this.props.lastPage

        if (totalPage > this.itemsToShow * 3) {
            let firstPage = current_page - this.itemsToShow < 1 ? 1 : current_page - this.itemsToShow
            let lastPage = current_page + this.itemsToShow > totalPage ? totalPage : current_page + this.itemsToShow

            if (current_page > this.itemsToShow + 1) {
                pagination.push(
                    <div key="holder_p_1" className="holder">
                        ...
                    </div>
                )
            } else {
                lastPage = this.itemsToShow * 2 + 2
            }

            if (current_page + this.itemsToShow > totalPage) {
                firstPage = lastPage - this.itemsToShow * 2 - 1
            }

            if (current_page + this.itemsToShow === totalPage - 1) {
                lastPage = lastPage + 1
            }
            if (current_page + this.itemsToShow === totalPage) {
                firstPage = firstPage - 1
            }

            for (let i = firstPage + 1; i <= lastPage - 1; i++) {
                let activeClass = current_page === i ? 'active_page' : ''
                pagination.push(
                    <div key={i} page={i} className={'page ' + ('page' + this.state.key + ' ') + activeClass} onClick={this.getPage(i)}>
                        {i}
                    </div>
                )
            }

            if (current_page + this.itemsToShow + 1 < totalPage) {
                pagination.push(
                    <div key="holder_p_2" className="holder">
                        ...
                    </div>
                )
            }
        } else {
            for (let i = 2; i <= totalPage - 1; i++) {
                let activeClass = current_page === i ? 'active_page' : ''
                pagination.push(
                    <div key={i} page={i} className={'page ' + ('page' + this.state.key + ' ') + activeClass} onClick={this.getPage(i)}>
                        {i}
                    </div>
                )
            }
        }
        pagination.push(
            <div
                key="last_page"
                className={'page ' + ('page' + this.state.key + ' ') + (current_page === totalPage ? 'active_page' : '')}
                page={totalPage}
                onClick={this.getPage(totalPage)}
            >
                {totalPage}
            </div>
        )
        return pagination
    }

    getPage = (page) => async (e) => {
        let current_page = this.props.datatable[this.props.accessibilityKey] ? this.props.datatable[this.props.accessibilityKey].current_page : 1
        if (page !== current_page && !this.props.progressPending) {
            if (this.props.onChangePage) {
                this.props.onChangePage(page)
            }
            await this.props.setDTPaginationTo(this.state.key, page)
        }
    }

    onChangeLimit = (e) => {
        this.setState((state) => {
            state.limit = e.target.value
            return { ...state }
        })
        this.props.onChangeLimit(e.target.value)
    }

    render() {
        let current_page = this.props.datatable[this.props.accessibilityKey] ? this.props.datatable[this.props.accessibilityKey].current_page : 1
        return (
            <Grid container alignItems="center" spacing={3}>
                <Grid item xs={3} className="mb-0">
                    {this.props.onChangeLimit ? (
                        <div className="pagination_limit_section">
                            <span className="ml-1">تعداد در هر صفحه</span>
                            <FormControl>
                                <Select className="selection_input_limit" value={this.state.limit} onChange={this.onChangeLimit} input={<BootstrapInput />}>
                                    <MenuItem value={10} className="text-center">
                                        10
                                    </MenuItem>
                                    <MenuItem value={25} className="text-center">
                                        25
                                    </MenuItem>
                                    <MenuItem value={50} className="text-center">
                                        50
                                    </MenuItem>
                                    <MenuItem value={100} className="text-center">
                                        100
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <span className="mr-2">ردیف</span>
                        </div>
                    ) : null}
                </Grid>
                <Grid item xs={6} className="mb-0">
                    {this.props.lastPage > 1 ? (
                        <div className={'pagination ' + ('private_pagination' + this.state.key)}>
                            <div key="prev_page" className="changePage" onClick={this.getPage(current_page === 1 ? current_page : current_page - 1)}>
                                <ArrowForwardIcon />
                            </div>
                            <div className="pagination_pages">
                                {this.pagination()}
                            </div>
                            <div
                                key="next_page"
                                className="changePage"
                                onClick={this.getPage(current_page === this.props.lastPage ? current_page : current_page + 1)}
                            >
                                <ArrowBackIcon />
                            </div>
                        </div>
                    ) : null}
                </Grid>
                {this.props.totalItem ? (
                    <Grid item xs={3} className="pagination_total_row mb-0">
                        <span className="ml-2">تعداد کل </span>
                        <span className="pagination_total_items">{this.props.totalItem ? Number33(this.props.totalItem) : null}</span>
                        <span className="mr-2">ردیف</span>
                    </Grid>
                ) : null}
            </Grid>
        )
    }
}
const mapStateToProps = (state) => ({
    datatable: state.smartcrud,
})

const mapDispatchToProps = (dispatch) => ({
    setDTPaginationTo: (key, page) => dispatch(setDTPaginationTo(key, page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Pagination)
