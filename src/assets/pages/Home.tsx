import MainLayout from "../layout/MainLayout";

import Breadcrumb from "../components/Breadcrumb";
import QuickActions from "../components/QuickActions";
import ActivityTimeline from "../components/ActivityTimeline";
import NotificationWidget from "../components/NotificationWidget";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTalathiUser } from "../services/TalathiAuthservice";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("ferfartoken");

    if (!token) {
      // navigate("/logout?logout=true");
      return;
    }

    localStorage.setItem("ferfartoken", token);
    //console.log("token saved", token);

    getTalathiUser(token ?? "")
      .then(({ token, userInfo }) => {

        useAuthStore.getState().setAuth(token, userInfo);

      })
      .catch((error) => {

        navigate("/session-expired", {
          state: {
            message: error.message,
          },
        });

      });

  }, [navigate]);


  // useEffect(() => {
  //   const token = localStorage.getItem("ferfartoken");

  //   getTalathiUser(token ?? "")
  //     .then(({ token, userInfo }) => {

  //       authStore.getState().setAuth(token, userInfo);

  //     })
  //     .catch((error) => {

  //       navigate("/session-expired", {
  //         state: {
  //           message: error.message,
  //         },
  //       });

  //     });

  // }, []);

  return (
    <MainLayout>
      <Breadcrumb />

      {/* <WelcomeBanner />

      <div className="mt-5">
        <AlertCard />
      </div> */}

      <div className="section-spacing">
        <QuickActions />
      </div>

      {/* <div className="grid grid-cols-4 gap-4 mt-5">

        <KipCard
          title="Total Roads"
          value={6}
        />

        <KipCard
          title="Draft Records"
          value={2}
        />

        <KipCard
          title="Submitted"
          value={4}
        />

        <KipCard
          title="Pending"
          value={2}
        />

      </div> */}

      <div className="home-grid">

        <div className="home-grid-main">
          <ActivityTimeline />
        </div>

        <div className="home-grid-side">
          <NotificationWidget />
        </div>

      </div>

      {/* <div className="grid grid-cols-12 gap-5 mt-5">

        <div className="col-span-8">
          <DistrictChart />
        </div>

        <div className="col-span-4">
          <RoadTypeChart />
        </div>

      </div> */}

    </MainLayout>
  );
}