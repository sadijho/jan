const db = require('../config/db');

const Report = {
  getSummary: (filters, callback) => {
    const conditions = [];
    const params = [];

    if (filters.dateFrom) {
      conditions.push('DATE(o.due_date) >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('DATE(o.due_date) <= ?');
      params.push(filters.dateTo);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const summaryQuery = `
      SELECT
        COUNT(DISTINCT o.id) AS totalOrders,
        COUNT(DISTINCT CASE WHEN o.status = 'zrealizowane' THEN o.id END) AS completedOrders,
        COUNT(DISTINCT CASE WHEN o.status = 'w trakcie' THEN o.id END) AS inProgressOrders,
        COALESCE(SUM(op.quantity), 0) AS totalItems
      FROM Orders o
      LEFT JOIN OrderProducts op ON o.id = op.order_id
      ${whereClause}
    `;

    const employeeRankingQuery = `
      SELECT
        u.id AS userId,
        u.username,
        u.first_name AS firstName,
        u.last_name AS lastName,
        COUNT(DISTINCT o.id) AS ordersCount,
        COALESCE(SUM(op.quantity), 0) AS itemsCount,
        COUNT(DISTINCT CASE WHEN o.status = 'zrealizowane' THEN o.id END) AS completedOrders,
        COUNT(DISTINCT CASE WHEN o.status = 'w trakcie' THEN o.id END) AS inProgressOrders
      FROM Orders o
      JOIN Users u ON o.user_id = u.id
      LEFT JOIN OrderProducts op ON o.id = op.order_id
      ${whereClause}
      GROUP BY u.id, u.username, u.first_name, u.last_name
      ORDER BY ordersCount DESC, itemsCount DESC
    `;

    const productRankingQuery = `
      SELECT
        p.id AS productId,
        p.name AS productName,
        m.name AS manufacturerName,
        COUNT(DISTINCT o.id) AS ordersCount,
        COALESCE(SUM(op.quantity), 0) AS itemsCount
      FROM Orders o
      JOIN OrderProducts op ON o.id = op.order_id
      JOIN Products p ON op.product_id = p.id
      LEFT JOIN Manufacturers m ON p.manufacturer_id = m.id
      ${whereClause}
      GROUP BY p.id, p.name, m.name
      ORDER BY itemsCount DESC, ordersCount DESC
    `;

    db.query(summaryQuery, params, (summaryErr, summaryResults) => {
      if (summaryErr) return callback(summaryErr);

      db.query(employeeRankingQuery, params, (employeeErr, employeeResults) => {
        if (employeeErr) return callback(employeeErr);

        db.query(productRankingQuery, params, (productErr, productResults) => {
          if (productErr) return callback(productErr);

          const summary = summaryResults[0] || {
            totalOrders: 0,
            completedOrders: 0,
            inProgressOrders: 0,
            totalItems: 0,
          };

          const topEmployee = employeeResults[0]
            ? `${employeeResults[0].firstName || ''} ${employeeResults[0].lastName || ''}`.trim()
              || employeeResults[0].username
            : null;

          const topProduct = productResults[0]
            ? productResults[0].productName
            : null;

          callback(null, {
            summary: {
              totalOrders: Number(summary.totalOrders || 0),
              completedOrders: Number(summary.completedOrders || 0),
              inProgressOrders: Number(summary.inProgressOrders || 0),
              totalItems: Number(summary.totalItems || 0),
              topEmployee,
              topProduct,
            },
            employeeRanking: employeeResults.map((employee) => ({
              userId: employee.userId,
              username: employee.username,
              employeeName:
                `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
                || employee.username,
              ordersCount: Number(employee.ordersCount || 0),
              itemsCount: Number(employee.itemsCount || 0),
              completedOrders: Number(employee.completedOrders || 0),
              inProgressOrders: Number(employee.inProgressOrders || 0),
            })),
            productRanking: productResults.map((product) => ({
              productId: product.productId,
              productName: product.productName,
              manufacturerName: product.manufacturerName || null,
              ordersCount: Number(product.ordersCount || 0),
              itemsCount: Number(product.itemsCount || 0),
            })),
          });
        });
      });
    });
  },
};

module.exports = Report;