# Node Sequelize Datatable
![Sequelize](https://sequelize.org/v5/manual/asset/logo-small.png)
![Datatable](https://larsbutnotleast.xyz/genius/res/datatables.png)

### Dependencies

This Package is currently using following dependencies.
```
* [Sequelize] - "^5.12.3"
* [Lodash]    - "^4.17.15"
```

```js 
const { Category } = require('../../models');     // your model 
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