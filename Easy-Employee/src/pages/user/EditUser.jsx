import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { updateUser, getUser } from "../../http";
import Modal from "../../components/modal/Modal";

const EditUser = () => {
  const initialState = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    type: "",
    address: "",
    profile: "",
    status: "",
  };

  const [imagePreview, setImagePreview] = useState("/assets/icons/user.png");
  const [formData, setFormData] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [updateFormData, setUpdatedFormData] = useState({});
  const [userType, setUserType] = useState("User");

  const { id } = useParams();
  const history = useHistory(); // Initialize useHistory hook

  useEffect(() => {
    (async () => {
      const res = await getUser(id);
      if (res.success) {
        setUserType(res.data.type);
        setFormData(res.data);
        setImagePreview(res.data.image);
      }
    })();
  }, [id]);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
    setUpdatedFormData((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (updateFormData.type && !showModal) return setShowModal(true);

    const fd = new FormData();
    Object.keys(updateFormData).map((key) => {
      return fd.append(key, updateFormData[key]);
    });

    const { success, message } = await updateUser(id, fd);
    if (success) {
      toast.success(message); // Show success toast
      handleClose(); // Redirect based on user type
    } else {
      toast.error(message); // Show error toast in case of failure
    }
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    setFormData((old) => {
      return {
        ...old,
        profile: file,
      };
    });

    setUpdatedFormData((old) => {
      return {
        ...old,
        profile: file,
      };
    });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const modalAction = () => setShowModal((showModal) => !showModal);

  // Close button handler to redirect
  const handleClose = () => {
    // Redirect based on current user type when closing
    switch (userType.toLowerCase()) {
      case "employee":
        history.push("/employees");
        break;
      case "leader":
        history.push("/leaders");
        break;
      case "admin":
        history.push("/admins");
        break;
      default:
        history.push("/employees");
    }
  };

  return (
    <>
      {showModal && (
        <Modal close={modalAction} title="Update User" width="35%">
          <div className="row" style={{ margin: "20px" }}>
            <div className="col col-md-4">
              <div className="input-group justify-content-center text-center">
                <img
                  className="rounded"
                  src={imagePreview}
                  width="120"
                  alt=""
                />
              </div>
            </div>
            <div className="col col-md-8">
              <table className="table table-md">
                <tr>
                  <th>Name</th>
                  <td>{formData.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <th>User Type</th>
                  <td>{formData.type}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="form-group col-md-12">
            <label>Enter Your Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fas fa-lock"></i>
                </div>
              </div>
              <input
                onChange={inputEvent}
                value={formData.adminPassword}
                type="password"
                placeholder={`Enter Your Password To Change ${formData.name}'s Type`}
                id="adminPassword"
                name="adminPassword"
                className="form-control"
              />
            </div>
          </div>
          <div className="justify-content-center text-center mb-3">
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              form="updateUserForm"
              style={{ width: "30vh" }}
            >
              Add {formData.type}
            </button>
          </div>
        </Modal>
      )}

      <div className="main-content">
        <section className="section">
          <HeaderSection title="Salary Details" />
          <div className="card"></div>

          <div className="card">
            <div className="card-body pr-5 pl-5 m-1">
              <form className="row" onSubmit={onSubmit} id="updateUserForm">
                <div className="form-group col-md-12 text-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-primary mb-0 ml-4">
                      <i
                        className="fas fa-user-circle mr-2"
                        style={{ fontSize: "20px" }}
                      ></i>
                      Edit {userType}
                    </h5>
                    <button
                      className="btn btn-light btn-sm"
                      onClick={handleClose}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="input-group justify-content-center">
                    <input
                      type="file"
                      id="profile"
                      name="profile"
                      className="form-control d-none"
                      onChange={captureImage}
                      accept="image/*"
                    />
                    <label htmlFor="profile">
                      {" "}
                      <img
                        className="rounded"
                        src={imagePreview}
                        width="120"
                        alt=""
                      />{" "}
                    </label>
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Name</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.name}
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.email}
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Enter Username</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user-circle"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.username}
                      type="username"
                      id="username"
                      name="username"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-3">
                  <label>Enter Mobile Number</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.mobile}
                      type="tel"
                      id="mobile"
                      name="mobile"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-3">
                  <label>Enter Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.password}
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group col-md-3">
                  <label>User Type</label>
                  <select
                    name="type"
                    onChange={inputEvent}
                    value={formData.type}
                    className="form-control select2"
                  >
                    <option>Employee</option>
                    <option>Leader</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="form-group col-md-3">
                  <label>User Status</label>
                  <select
                    name="status"
                    onChange={inputEvent}
                    value={formData.status}
                    className="form-control select2"
                  >
                    <option>Active</option>
                    <option>Banned</option>
                  </select>
                </div>

                <div className="form-group col-md-12 ">
                  <label>Enter Address</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.address}
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group text-center col-md-12">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    style={{ width: "30vh" }}
                  >
                    Update {userType}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EditUser;
