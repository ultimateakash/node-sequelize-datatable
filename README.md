# Node Sequelize Datatable
![Sequelize](https://sequelize.org/v5/manual/asset/logo-small.png)
![Datatable](https://larsbutnotleast.xyz/genius/res/datatables.png)

### Dependencies

This Package is currently using following dependencies.
```
* [Sequelize] - "^5.12.3"
* [Lodash]    - "^4.17.15"
```
### Tested with angular-datatables 
* [angular-datatables] - https://www.npmjs.com/package/angular-datatables

Example request body
```json
{
    "draw": 1,
    "columns": [
        {
            "data": "id",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
                "value": "",
                "regex": false
            }
        },
        {
            "data": "category",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
                "value": "",
                "regex": false
            }
        }
    ],
    "order": [
        {
            "column": 0,
            "dir": "asc"
        }
    ],
    "start": 0,
    "length": 2,
    "search": {
        "value": "",
        "regex": false
    }
}
```
Example code for category model
```js 
const { Category } = require('../../models');   // your model 
const sequelizeDatatable = require('node-sequelize-datatable');  

exports.categoryTable = async function(req, res) {
    datatableObj = await sequelizeDatatable(req.body);
    var count = await Category.count();
    var categories = await Category.findAndCountAll(datatableObj);
    return res.json({
        "draw": req.body.draw,
        "recordsFiltered": categories.count,
        "recordsTotal": count,
        "data": categories.rows
    });
}
```
Angular Code
```ts
import { Component, OnInit } from '@angular/core';
import { Category } from '../models';
import { BlogService } from '../internal-blog/blog.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    categories: Category[];
    error: { error: '', message: '' };

    constructor(
        private blogService: BlogService
    ) { }

    ngOnInit(): void {
        const that = this;

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 2,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.blogService.categoryTable(dataTablesParameters).subscribe(resp => {
                    that.categories = resp.data;
                    callback({
                      recordsTotal: resp.recordsTotal,
                      recordsFiltered: resp.recordsFiltered,
                      data: []
                    });
                    console.log(resp);
                });
            },
            columns: [
                {
                    data: 'id'
                },
                {
                    data: 'category'
                }
            ]
        };
    }
}
```

```html
<section class="dashboard-wrap mtb-40">
    <div class="container">
        <div class="body-content">
            <div class="row">
                <div class="col-md-3">
                    <app-nav-bar></app-nav-bar>
                </div>
                <div class="col-md-9">
                    <div class="dash-right">
                        <table datatable [dtOptions]="dtOptions" class="row-border hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody *ngIf="categories?.length != 0">
                                <tr *ngFor="let category of categories">
                                    <td>{{ category.id }}</td>
                                    <td>{{ category.category }}</td>
                                </tr>
                            </tbody>
                            <tbody *ngIf="categories?.length == 0">
                                <tr>
                                    <td colspan="3" class="no-data-available">No data!</td>
                                </tr>
                                <tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```