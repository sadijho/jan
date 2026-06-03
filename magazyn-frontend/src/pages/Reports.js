import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar';

const Reports = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [report, setReport] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    pl: {
      title: 'Raporty',
      subtitle: 'Podsumowanie aktywności magazynowej',
      dateFrom: 'Data od',
      dateTo: 'Data do',
      generate: 'Generuj raport',
      clear: 'Wyczyść filtry',
      loading: 'Ładowanie raportu...',
      error: 'Nie udało się pobrać raportu.',
      totalOrders: 'Liczba zamówień',
      completedOrders: 'Zrealizowane',
      inProgressOrders: 'W trakcie',
      totalItems: 'Łączna liczba sztuk',
      topEmployee: 'Najaktywniejszy pracownik',
      topProduct: 'Najczęściej zamawiany produkt',
      employeeRanking: 'Ranking pracowników',
      productRanking: 'Ranking produktów',
      employee: 'Pracownik',
      ordersCount: 'Liczba zamówień',
      itemsCount: 'Liczba sztuk',
      product: 'Produkt',
      manufacturer: 'Producent',
      noData: 'Brak danych do wyświetlenia.',
      notAvailable: 'Brak danych',
      exportCsv: 'Eksport CSV',
      exportPdf: 'Eksport PDF',
      summary: 'Podsumowanie',
      metric: 'Metryka',
      value: 'Wartość',
      generatedAt: 'Wygenerowano',
      reportPeriod: 'Zakres raportu',
      allDates: 'Wszystkie daty',
    },
    en: {
      title: 'Reports',
      subtitle: 'Warehouse activity summary',
      dateFrom: 'Date from',
      dateTo: 'Date to',
      generate: 'Generate report',
      clear: 'Clear filters',
      loading: 'Loading report...',
      error: 'Failed to fetch report.',
      totalOrders: 'Total orders',
      completedOrders: 'Completed',
      inProgressOrders: 'In progress',
      totalItems: 'Total items',
      topEmployee: 'Top employee',
      topProduct: 'Top ordered product',
      employeeRanking: 'Employee ranking',
      productRanking: 'Product ranking',
      employee: 'Employee',
      ordersCount: 'Orders count',
      itemsCount: 'Items count',
      product: 'Product',
      manufacturer: 'Manufacturer',
      noData: 'No data to display.',
      notAvailable: 'No data',
      exportCsv: 'Export CSV',
      exportPdf: 'Export PDF',
      summary: 'Summary',
      metric: 'Metric',
      value: 'Value',
      generatedAt: 'Generated at',
      reportPeriod: 'Report period',
      allDates: 'All dates',
    },
  };

  const t = translations[language] || translations.pl;

  const normalizePdfText = (value) => {
    return String(value ?? '')
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ż/g, 'z')
      .replace(/ź/g, 'z')
      .replace(/Ą/g, 'A')
      .replace(/Ć/g, 'C')
      .replace(/Ę/g, 'E')
      .replace(/Ł/g, 'L')
      .replace(/Ń/g, 'N')
      .replace(/Ó/g, 'O')
      .replace(/Ś/g, 'S')
      .replace(/Ż/g, 'Z')
      .replace(/Ź/g, 'Z');
  };

  const pdfText = (value) => normalizePdfText(value);

  const fetchReport = async () => {
    const token = localStorage.getItem('token');

    setLoading(true);
    setError('');

    const params = new URLSearchParams();

    if (dateFrom) {
      params.append('dateFrom', dateFrom);
    }

    if (dateTo) {
      params.append('dateTo', dateTo);
    }

    try {
      const queryString = params.toString();
      const url = queryString
        ? `/api/reports/summary?${queryString}`
        : '/api/reports/summary';

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReport(response.data);
    } catch (err) {
      setReport(null);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const getReportPeriodLabel = () => {
    if (!dateFrom && !dateTo) {
      return t.allDates;
    }

    if (dateFrom && dateTo) {
      return `${dateFrom} - ${dateTo}`;
    }

    if (dateFrom) {
      return `${t.dateFrom}: ${dateFrom}`;
    }

    return `${t.dateTo}: ${dateTo}`;
  };

  const exportCsv = () => {
    if (!report) return;

    const rows = [];

    rows.push([t.title]);
    rows.push([t.generatedAt, new Date().toLocaleString()]);
    rows.push([t.reportPeriod, getReportPeriodLabel()]);
    rows.push([]);
    rows.push([t.summary]);
    rows.push([t.totalOrders, report.summary?.totalOrders || 0]);
    rows.push([t.completedOrders, report.summary?.completedOrders || 0]);
    rows.push([t.inProgressOrders, report.summary?.inProgressOrders || 0]);
    rows.push([t.totalItems, report.summary?.totalItems || 0]);
    rows.push([t.topEmployee, report.summary?.topEmployee || t.notAvailable]);
    rows.push([t.topProduct, report.summary?.topProduct || t.notAvailable]);

    rows.push([]);
    rows.push([t.employeeRanking]);
    rows.push([
      t.employee,
      t.ordersCount,
      t.itemsCount,
      t.completedOrders,
      t.inProgressOrders,
    ]);

    (report.employeeRanking || []).forEach((employee) => {
      rows.push([
        employee.employeeName,
        employee.ordersCount,
        employee.itemsCount,
        employee.completedOrders,
        employee.inProgressOrders,
      ]);
    });

    rows.push([]);
    rows.push([t.productRanking]);
    rows.push([
      t.product,
      t.manufacturer,
      t.ordersCount,
      t.itemsCount,
    ]);

    (report.productRanking || []).forEach((product) => {
      rows.push([
        product.productName,
        product.manufacturerName || '-',
        product.ordersCount,
        product.itemsCount,
      ]);
    });

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(';')
      )
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'raport-magazynu.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!report) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const summary = report.summary || {};
    const generatedAt = new Date().toLocaleString();
    const reportPeriod = getReportPeriodLabel();

    doc.setFontSize(18);
    doc.text(pdfText(t.title), 14, 16);

    doc.setFontSize(10);
    doc.text(pdfText(t.subtitle), 14, 23);
    doc.text(pdfText(`${t.generatedAt}: ${generatedAt}`), 14, 29);
    doc.text(pdfText(`${t.reportPeriod}: ${reportPeriod}`), 14, 35);

    autoTable(doc, {
      startY: 43,
      head: [[pdfText(t.metric), pdfText(t.value)]],
      body: [
        [pdfText(t.totalOrders), summary.totalOrders || 0],
        [pdfText(t.completedOrders), summary.completedOrders || 0],
        [pdfText(t.inProgressOrders), summary.inProgressOrders || 0],
        [pdfText(t.totalItems), summary.totalItems || 0],
        [pdfText(t.topEmployee), pdfText(summary.topEmployee || t.notAvailable)],
        [pdfText(t.topProduct), pdfText(summary.topProduct || t.notAvailable)],
      ],
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
      margin: {
        left: 14,
        right: 14,
      },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        pdfText(t.employee),
        pdfText(t.ordersCount),
        pdfText(t.itemsCount),
        pdfText(t.completedOrders),
        pdfText(t.inProgressOrders),
      ]],
      body: (report.employeeRanking || []).map((employee) => [
        pdfText(employee.employeeName),
        employee.ordersCount,
        employee.itemsCount,
        employee.completedOrders,
        employee.inProgressOrders,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [22, 163, 74],
      },
      margin: {
        left: 14,
        right: 14,
      },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        pdfText(t.product),
        pdfText(t.manufacturer),
        pdfText(t.ordersCount),
        pdfText(t.itemsCount),
      ]],
      body: (report.productRanking || []).map((product) => [
        pdfText(product.productName),
        pdfText(product.manufacturerName || '-'),
        product.ordersCount,
        product.itemsCount,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [124, 58, 237],
      },
      margin: {
        left: 14,
        right: 14,
      },
    });

    doc.save('raport-magazynu.pdf');
  };

  const summary = report?.summary || {};

  return (
    <div className="app-shell">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        links={[]}
      />

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title mb-1">{t.title}</h1>
              <p className="text-sm text-slate-500">{t.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportCsv}
                className="btn-success"
                disabled={!report}
              >
                {t.exportCsv}
              </button>

              <button
                type="button"
                onClick={exportPdf}
                className="btn-primary"
                disabled={!report}
              >
                {t.exportPdf}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
            <div>
              <label className="form-label">{t.dateFrom}</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t.dateTo}</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="button"
              onClick={fetchReport}
              className="btn-primary"
            >
              {t.generate}
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-muted"
            >
              {t.clear}
            </button>
          </div>

          {loading && (
            <div className="empty-state mt-6">
              {t.loading}
            </div>
          )}

          {error && !loading && (
            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {report && !loading && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.totalOrders}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.totalOrders || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.completedOrders}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.completedOrders || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.inProgressOrders}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.inProgressOrders || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.totalItems}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.totalItems || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.topEmployee}</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {summary.topEmployee || t.notAvailable}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">{t.topProduct}</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {summary.topProduct || t.notAvailable}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">
                    {t.employeeRanking}
                  </h2>

                  {report.employeeRanking?.length > 0 ? (
                    <div className="data-table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{t.employee}</th>
                            <th>{t.ordersCount}</th>
                            <th>{t.itemsCount}</th>
                            <th>{t.completedOrders}</th>
                            <th>{t.inProgressOrders}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.employeeRanking.map((employee) => (
                            <tr key={employee.userId}>
                              <td>{employee.employeeName}</td>
                              <td>{employee.ordersCount}</td>
                              <td>{employee.itemsCount}</td>
                              <td>{employee.completedOrders}</td>
                              <td>{employee.inProgressOrders}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">{t.noData}</div>
                  )}
                </section>

                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">
                    {t.productRanking}
                  </h2>

                  {report.productRanking?.length > 0 ? (
                    <div className="data-table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{t.product}</th>
                            <th>{t.manufacturer}</th>
                            <th>{t.ordersCount}</th>
                            <th>{t.itemsCount}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.productRanking.map((product) => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>{product.manufacturerName || '-'}</td>
                              <td>{product.ordersCount}</td>
                              <td>{product.itemsCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">{t.noData}</div>
                  )}
                </section>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Reports;