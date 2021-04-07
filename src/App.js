import React, { Component } from 'react'
import { SmartCrud } from './module'

class App extends Component {
    columns = [
        {
            name: 'شماره همراه',
            selector: 'mobile',
            searchable: true,
            grow: 2,
        },
        {
            name: 'نام',
            selector: 'profile.name',
            searchable: true,
            grow: 2,
        },
        {
            name: 'نام خانوادگی',
            selector: 'profile.family',
            searchable: true,
            grow: 2,
        },
        {
            name: 'دسترسی',
            selector: 'merchants',
            searchable: false,
            grow: 3,
            cell: (row) => {
                let roles = row.merchants.map((item) => (item.pivot ? item.pivot.type : null)).filter((item) => item !== null)
                return roles.map((role) => role).join(', ')
            },
        },
        {
            name: 'تاریخ ایجاد',
            selector: 'created_at',
            sortableFilter: true,
            isDefaultSort: 'desc',
            grow: 2,
            cell: (row) => {
                return row.profile ? row.profile.created_at : null
            },
        },
    ]

    filter = [
        {
            label: 'شماره موبایل',
            selector: 'mobile',
            type: 'text',
        },
        {
            label: 'نام',
            selector: 'profile.name',
            type: 'text',
        },
        {
            label: 'نام خانوادگی',
            selector: 'profile.family',
            type: 'text',
        },
        {
            label: 'تاریخ ایجاد',
            selector: 'created_at',
            type: 'date',
            variant: 'inline',
        },
        {
            label: 'حالت',
            selector: 'complite',
            type: 'select',
            items: [
                {
                    label: 'تکمیل نشده',
                    value: [
                        [
                            ['profile.name', '=', null],
                            ['profile.family', '=', null],
                        ],
                    ],
                },
                {
                    label: 'تکمیل شده',
                    value: [
                        ['profile.name', '!=', ''],
                        ['profile.family', '!=', ''],
                    ],
                },
            ],
        },
    ]

    inputs = [
        {
            selector: 'mobile',
            type: 'text', // [text | textarea | number | select | multiselect | image | map | color ],
            label: 'شماره موبایل',
            col: 6,
            isRequired: true,
            editable: false,
            direction: 'ltr',
            format: (value) => {
                value = value.replace(/[^0-9]/g, '').substr(0, 11)
                return value
            },
        },
        {
            selector: 'profile.name',
            type: 'text',
            label: 'نام',
            col: 6,
            isRequired: true,
            editable: true,
        },
        {
            selector: 'profile.family',
            type: 'text',
            label: 'نام خانوادگی',
            col: 6,
            isRequired: true,
            editable: true,
        },
        {
            selector: 'profile.email',
            type: 'text',
            label: 'ایمیل',
            direction: 'ltr',
            col: 6,
            isRequired: false,
            editable: true,
        },

        {
            selector: 'profile.pinCode',
            type: 'password',
            label: 'پین کد',
            col: 6,
            isRequired: false,
            editable: true,
            format: (value) => {
                value = value.replace(/[^0-4]/g, '').substr(0, 4)
                return value
            },
        },
        {
            selector: 'profile.password',
            type: 'password',
            label: 'رمزعبور',
            col: 6,
            isRequired: false,
            editable: false,
        },
        {
            selector: 'profile.birthday',
            type: 'birthday',
            label: 'تاریخ تولد',
            col: 6,
            isRequired: false,
            editable: true,
        },
        {
            selector: 'profile.gender',
            type: 'radio',
            label: 'جنسیت',
            col: 6,
            isRequired: true,
            options: [
                {
                    label: 'مذکر',
                    value: 'male',
                },
                {
                    label: 'مونث',
                    value: 'female',
                },
            ],
            editable: true,
        },
        {
            selector: 'addresses.latlng',
            type: 'map',
            label: 'مختصات مکانی',
            col: 12,
            isRequired: false,
            editable: true,
        },
        {
            selector: 'background_color',
            type: 'color',
            label: 'رنگ',
            col: 2,
            isRequired: false,
            editable: true,
        },
        {
            selector: 'count',
            type: 'increments',
            label: 'تعداد',
            col: 2,
            isRequired: true,
            editable: true,
            min: 0
        },
    ]

    hasMany = [
        {
            relation: 'merchants',
            label: 'شعب',
            minItems: 1,
            maxItems: 100,
            inputs: [
                {
                    selector: 'id',
                    type: 'select',
                    label: 'شعبه',
                    col: 6,
                    isRequired: true,
                    editable: true,
                    options: `/api/v4/merchants?page_size=1000`,
                },
                {
                    selector: 'pivot.type',
                    type: 'select',
                    label: 'دسترسی',
                    col: 6,
                    isRequired: true,
                    editable: true,
                    options: [
                        { label: 'مشتری', value: 'customer' },
                        { label: 'پرسنل', value: 'personnel' },
                        { label: 'مدیر شعبه', value: 'merchant_admin' },
                    ],
                },
            ],
        },
    ]

    render() {
        return (
            <div>
                <SmartCrud
                    title="کاربران"
                    inputs={this.inputs}
                    hasMany={this.hasMany}
                    editable
                    deletable
                    morphMapKey="Category"
                    morphMany={['Tags']}
                    route={'/api/v4/users'}
                    columns={this.columns}
                    filters={this.filter}
                    relations={['profile', 'merchants']}
                    appendFilter={[['profile.name', '!=', null]]}
                />
            </div>
        )
    }
}

export default App
