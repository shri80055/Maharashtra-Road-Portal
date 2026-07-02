

// import { useMemo, useState } from "react";
// import {
//   BookOpen,
//   ClipboardList,
//   FileCheck2,
//   FileText,
//   FolderOpen,
//   Map,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import MainLayout from "../layout/MainLayout";
// import Breadcrumb from "../components/Breadcrumb";
// import GeoFiltersCard from "../components/register/GeoFiltersCard";
// import ModulesGrid from "../components/register/ModulesGrid";
// import type { ModuleCardModel } from "../components/register/ModuleCard";




import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getTalathiUser } from "../services/TalathiAuthservice";

import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import GeoFiltersCard from "../components/register/GeoFiltersCard";
import ModulesGrid from "../components/register/ModulesGrid";
import type { ModuleCardModel } from "../components/register/ModuleCard";

type Option = {
  value: string;
  label: string;
};


export default function RegisterRoad() {
  const navigate = useNavigate();

const [districtOptions,setDistrictOptions] = useState<Option[]>([]);

const [talukaOptions,setTalukaOptions] = useState<Option[]>([]);

const [villageOptions,setVillageOptions] = useState<Option[]>([]);

  const [filters, setFilters] = useState({
    district: "",
    taluka: "",
    village: "",
  });

  // const districtOptions = [
  //   { value: "", label: "Select District" },
  //   { value: "Pune", label: "Pune" },
  //   { value: "Nashik", label: "Nashik" },
  //   { value: "Nagpur", label: "Nagpur" },
  // ];

  // const talukaOptions = useMemo(() => {
  //   if (!filters.district)
  //     return [{ value: "", label: "First select District" }];

  //   return [
  //     { value: "", label: "Select Taluka" },
  //     { value: "Taluka 1", label: "Taluka 1" },
  //     { value: "Taluka 2", label: "Taluka 2" },
  //   ];
  // }, [filters.district]);

  // const villageOptions = useMemo(() => {
  //   if (!filters.taluka)
  //     return [{ value: "", label: "First select Taluka" }];

  //   return [
  //     { value: "", label: "Select Village" },
  //     { value: "Village 1", label: "Village 1" },
  //     { value: "Village 2", label: "Village 2" },
  //   ];
  // }, [filters.taluka]);


  useEffect(() => {
  fetch("http://localhost:3190/ReactActive.aspx", {
    credentials: "include",
  }).then(() => {
    console.log("React opened");
  });

  const logoutHandler = (event: StorageEvent) => {
    if (event.key === "logout" && event.newValue) {
      localStorage.removeItem("ferfartoken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("infouser");

      navigate("/logout?logout=true");
    }
  };

  window.addEventListener("storage", logoutHandler);

  const ferfarToken = localStorage.getItem("ferfartoken");

  if (!ferfarToken) {
    console.log("Token not found");
    navigate("/logout?logout=true");
    return;
  }

  getTalathiUser(ferfarToken)
   .then((response: any) => {
      const result = response.data;

      if (!result.token || !result.userInfo) {
        navigate("/logout?logout=true");
        return;
      }

      localStorage.setItem("access_token", result.token);
      localStorage.setItem("infouser", JSON.stringify(result.userInfo));

      const userdetails = result.userInfo;

      setDistrictOptions([
        {
          value: userdetails.distCode,
          label: userdetails.districtName,
        },
      ]);

      setTalukaOptions([
        {
          value: userdetails.talcode,
          label: userdetails.talukaName,
        },
      ]);

      setVillageOptions([
        {
          value: userdetails.vlgCode,
          label: userdetails.village,
        },
      ]);

      setFilters({
        district: userdetails.distCode,
        taluka: userdetails.talcode,
        village: userdetails.vlgCode,
      });
    })
.catch((error: any) => {
        console.log("LOGIN API ERROR", error.response?.data);
      navigate("/logout?logout=true");
    });

  return () => {
    window.removeEventListener("storage", logoutHandler);
  };
}, [navigate]);




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

  const handlePraroop2 = () => {
    if (
      !filters.district ||
      !filters.taluka ||
      !filters.village
    ) {
      alert("Please select District, Taluka and Village");
      return;
    }

    navigate("/praroop2", {
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

const modules: ModuleCardModel[] = [
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
      onClick: handlePraroop2,
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
