const Report = require('../models/report');

exports.getSummaryReport = (req, res) => {
  const { dateFrom, dateTo } = req.query;

  const filters = {
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  };

  Report.getSummary(filters, (err, report) => {
    if (err) {
      console.error('Błąd podczas generowania raportu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json(report);
  });
};