import React, { useState, useEffect } from "react";

export const FetchReport = (api) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const report = await fetch(api);
        const reportData = await report.json();
        setReport(reportData);
        console.log(reportData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [api]);

  return { report, error, loading };
};