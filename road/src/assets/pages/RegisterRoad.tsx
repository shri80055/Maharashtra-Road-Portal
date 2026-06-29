import { useMemo, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import GeoFiltersCard from "../components/register/GeoFiltersCard";
import ModulesGrid from "../components/register/ModulesGrid";

export default function RegisterRoad() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    district: "",
    taluka: "",
    village: "",
  });

  const districtOptions = [
    { value: "", label: "Select District" },
    { value: "Pune", label: "Pune" },
    { value: "Nashik", label: "Nashik" },
    { value: "Nagpur", label: "Nagpur" },
  ];

  const talukaOptions = useMemo(() => {
    if (!filters.district)
      return [{ value: "", label: "First select District" }];

    return [
      { value: "", label: "Select Taluka" },
      { value: "Taluka 1", label: "Taluka 1" },
      { value: "Taluka 2", label: "Taluka 2" },
    ];
  }, [filters.district]);

  const villageOptions = useMemo(() => {
    if (!filters.taluka)
      return [{ value: "", label: "First select Taluka" }];

    return [
      { value: "", label: "Select Village" },
      { value: "Village 1", label: "Village 1" },
      { value: "Village 2", label: "Village 2" },
    ];
  }, [filters.taluka]);

  const handlePraroop1 = () => {
    if (
      !filters.district ||
      !filters.taluka ||
      !filters.village
    ) {
      alert("Please select District, Taluka and Village");
      return;
    }

    navigate("/praroop1", {
      state: filters,
    });
  };


  const handleDraftRecords = () => {
    navigate("/drafts", {
        state: filters,
      });
  }

  const handleSubmittedRecords = () => {
    navigate("/submitted", {
        state: filters,
      });
  }

  const modules = [
    {
      title: "Praroop-1 (Village Map Roads)",
      description:
        "Register existing village roads mapped on official layouts.",
      icon: Map,
      cta: "Access Form",
      accent: "teal",
      onClick: handlePraroop1,
    },
    {
      title: "Praroop-2 (Non-Mapped Roads)",
      description:
        "Register newly proposed or unmapped rustic pathways.",
      icon: FileText,
      cta: "Access Form",
      accent: "orange",
      onClick: () => {},
    },
    {
      title: "Praroop-3 Register",
      description:
        "Access the formal Village Road Register categorizations.",
      icon: BookOpen,
      cta: "Open Register",
      accent: "blue",
      onClick: () => {},
    },
    {
      title: "Draft Records Registry",
      description:
        "View and manage draft records.",
      icon: FolderOpen,
      cta: "Manage Drafts",
      accent: "amber",
      onClick: handleDraftRecords,
    },
    {
      title: "Submitted Road Records",
      description:
        "Track submitted registrations.",
      icon: FileCheck2,
      cta: "Track Status",
      accent: "green",
      onClick: handleSubmittedRecords,
    },
    {
      title: "MIS Reports & Charts",
      description:
        "Generate reports and analytics.",
      icon: ClipboardList,
      cta: "Open Reports",
      accent: "teal",
      onClick: () => {},
    },
  ];

  return (
    <MainLayout>
      <Breadcrumb crumbs={[{ label: "Road Registration" }]} />

      <div className="rr-page-header">
        <h1 className="rr-page-title">
          Road Registration Portal
        </h1>

        <p className="rr-page-subtitle">
          Select administrative filters and continue.
        </p>
      </div>

      <div className="rr-stack">
        <GeoFiltersCard
          values={filters}
          onChange={setFilters}
          districtOptions={districtOptions}
          talukaOptions={talukaOptions}
          villageOptions={villageOptions}
          disabled={{
            taluka: !filters.district,
            village: !filters.taluka,
          }}
        />

        <ModulesGrid modules={modules} />
      </div>
    </MainLayout>
  );
}