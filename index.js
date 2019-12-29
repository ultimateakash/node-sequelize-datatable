const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async (body) => {
    var searchStr, pagination, column, order, index,
        attributes, search, datatableObj, query;

    search = body.search.value;
    attributes = _.map(body.columns, 'data');
    if (search) {
        query = _.map(body.columns, function(value, key) {
            return {
                [value.data]: {
                    [Op.like]: '%' + search + '%'
                }
            };
        });
        searchStr = {
            where: {
                [Op.or]: query
            }
        };
    } else {
        searchStr = {};
        searchStr.attributes = attributes;
    }
    if (body.order.length > 0) {
        index = body.order[0].column;
        order = body.order[0].dir;
    } else {
        index = 0;
        order = 'asc';
    }
    column = await getColumn(attributes, index);
    pagination = {
        attributes: attributes,
        offset: parseInt(body.start),
        limit: parseInt(body.length),
        order: [
            [column, order]
        ],
    };
    return datatableObj = _.merge(searchStr, pagination);
}

async function getColumn(body, column) {
    return _.get(body, column)
}