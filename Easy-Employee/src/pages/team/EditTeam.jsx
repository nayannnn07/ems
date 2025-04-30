import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { getTeam, updateTeam } from "../../http";

const EditTeam = () => {
  const [imagePreview, setImagePreview] = useState("/assets/icons/team.png");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: "",
  });
  const [updateFormData, setUpdatedFormData] = useState({});
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const res = await getTeam(id);
      if (res.success) {
        setFormData(res.data);
        setImagePreview(res.data.image);
      }
    })();
  }, [id]);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({
      ...old,
      [name]: value,
    }));

    setUpdatedFormData((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, description } = formData;
    if (!name || !description) return toast.error("All Fields Required");

    const fd = new FormData();
    Object.keys(updateFormData).map((key) => {
      return fd.append(key, updateFormData[key]);
    });
    const res = await updateTeam(id, fd);
    return res.success && toast.success(res.message);
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    setFormData((old) => ({
      ...old,
      image: file,
    }));

    setUpdatedFormData((old) => ({
      ...old,
      image: file,
    }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const handleClose = () => {
    history.push("/teams");
  };

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="section-header d-flex justify-content-between align-items-center">
            <h4 className="text-primary mb-0 ml-4">
              <i className="fas fa-users mr-2" style={{ fontSize: "20px" }}></i>
              Edit Team
            </h4>
          </div>

          <div className="card">
            <div className="card-body pr-5 pl-5 m-1">
              <form className="row" onSubmit={onSubmit}>
                <div className="input-group justify-content-center">
                  {/* Header Row with Edit and X button */}
                  <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <div>
                      <h5 className="text-primary mb-0 ml-4">
                        <i
                          className="fas fa-user-circle mr-2"
                          style={{ fontSize: "20px" }}
                        ></i>
                        Edit
                      </h5>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={handleClose}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>

                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control d-none"
                    onChange={captureImage}
                    accept="image/*"
                  />
                  <label htmlFor="image">
                    <img
                      className="rounded"
                      src={imagePreview}
                      width="120"
                      alt=""
                    />
                  </label>
                </div>

                <div className="form-group col-md-6">
                  <label>Enter Team Name</label>
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

                <div className="form-group col-md-6">
                  <label>Team Status</label>
                  <select
                    name="status"
                    onChange={inputEvent}
                    value={formData.status}
                    className="form-control select2"
                  >
                    <option>Active</option>
                    <option>Banned</option>
                    <option>Expired</option>
                    <option>Deleted</option>
                  </select>
                </div>

                <div className="form-group col-md-12">
                  <label>Enter Team Description</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-file-alt"></i>
                      </div>
                    </div>
                    <input
                      onChange={inputEvent}
                      value={formData.description}
                      type="text"
                      id="description"
                      name="description"
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
                    Update Team
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

export default EditTeam;
