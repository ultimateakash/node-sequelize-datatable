# node-sequelize-datatable
sequelize server side datatable handler

```js 
var { Category } = require('../../models');     // your model 
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