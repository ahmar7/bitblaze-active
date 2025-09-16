import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { patchCoinsApi, signleUsersApi, updateSignleUsersApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Switch, CircularProgress } from "@mui/material";
import { Button } from "react-bootstrap";
import AdminHeader from "../adminHeader";
const AdminPermissions = () => {
  //

  let authUser = useAuthUser();
  let Navigate = useNavigate();

  const [allowManageSubAdmins, setAllowManageSubAdmins] = useState(false);
  const [allowEditProfile, setAllowEditProfile] = useState(false);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [newDescription, setnewDescription] = useState("");
  const [isDisable, setisDisable] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    progress: 0,
    AiTradingPercentage: 1.5,
  });


  //

  let { id } = useParams();

  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  const [currency, setCurrency] = useState("");


  const getSignleUser = async () => {
    try {
      const signleUser = await signleUsersApi(id);

      if (signleUser.success) {

        if (signleUser.signleUser.role != "admin") {
          Navigate("/admin/dashboard")
        }
        setUserData(signleUser.signleUser);
        setCurrency(signleUser.signleUser.currency)
        setAllowManageSubAdmins(signleUser?.signleUser?.isSubManagement) 
        setAllowEditProfile(signleUser?.signleUser?.isProfileUpdate)
        setnewDescription(signleUser.signleUser.note);

      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisLoading(false)
    }
  };
  const updateSignleUser = async (e) => {

    e.preventDefault();
    try {
      let editDesc = newDescription;
      if (
        editDesc === "<p><br></p>" ||
        editDesc === "<h1><br></h1>" ||
        editDesc === "<h2><br></h2>" ||
        editDesc === "<h3><br></h3>" ||
        editDesc === "<h4><br></h4>" ||
        editDesc === "<h5><br></h5>" ||
        editDesc === "<h6><br></h6>"
      ) {
        editDesc = "";
      } else {
        editDesc = newDescription;
      }
      let body = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        note: editDesc,
        address: userData.address,
        city: userData.city,
        progress: userData.progress,
        country: userData.country,
        postalCode: userData.postalCode,
        currency: currency,
        AiTradingPercentage: userData.AiTradingPercentage,
        isSubManagement: allowManageSubAdmins,
        isProfileUpdate: allowEditProfile
      };
      if (
        !body.firstName.trim() ||
        !body.lastName.trim() ||
        !body.email.trim() ||
        !body.password.trim() ||
        !body.address.trim() ||
        !body.city.trim() ||
        !body.country.trim() ||
        !body.phone ||
        !body.postalCode ||
        !currency
      ) {
        toast.error("Fields cannot be left blank except the note field!");

        return;
      }

      setisDisable(true);

      const signleUser = await updateSignleUsersApi(id, body);


      if (signleUser.success) {
        toast.dismiss();
        toast.success("Permissions updated successfuly");

      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }else if(authUser().user.role === "admin") {
      Navigate("/admin/dashboard");
      return;
    }
    getSignleUser();

  }, []);

  // new


  return (
    <>
      <div className="admin">
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">

          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            {/* Admin Permissions Section */}

            {isLoading ? <div className="mx-auto mt-10 loading-pg w-full text-center max-w-xs">
              <div className="mx-auto mt-10 max-w-xs new">
                <svg
                  data-v-cd102a71
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="icon h-12 w-12 text-primary-500"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity=".25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              </div>
              <div className="mx-auto max-w-sm">
                <h4 className="font-heading text-xl font-medium leading-normal leading-normal text-muted-800 mb-1 mt-4 dark:text-white">
                  Loading Admin Permissions
                </h4>
                <p className="text-muted-400 font-sans text-sm">
                  Please wait while we load the Admin Permissions.
                </p>
              </div>
            </div> : <div className="admin-permissions-section mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Admin Permissions
              </h2>

              <div className="permissions-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allow Admin to see/add/manage sub admins */}
                <div className="permission-card bg-white dark:bg-muted-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-muted-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Manage Sub-Admins
                    </h3>
                    <Switch
                      checked={allowManageSubAdmins}
                      onChange={() => setAllowManageSubAdmins(!allowManageSubAdmins)}
                      color="primary"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-muted-400">
                    Allow administrators to view, add, and manage sub-administrators in the system.
                  </p>
                </div>

                {/* Allow Admin to edit his profile */}
                <div className="permission-card bg-white dark:bg-muted-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-muted-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Edit Profile
                    </h3>
                    <Switch
                      checked={allowEditProfile}
                      onChange={() => setAllowEditProfile(!allowEditProfile)}
                      color="primary"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-muted-400">
                    Allow administrators to edit their own profile information and settings.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={updateSignleUser}
                  disabled={isDisable}
                  style={{ width: 'max-content' }}
                  className="is-button pointer flex align-center justify p-2 cursor-pointer bg-primary-400a rounded is-button-default w-full"
                >
                  {isDisable ? (
                    <div className="flex items-center">
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Saving...
                    </div>
                  ) : (
                    "Save Permissions"
                  )}
                </Button>
              </div>
            </div>}

          </div >


        </div >
      </div >
    </>
  );
};

export default AdminPermissions;
