import React from "react";
import { useRef, useState, useEffect } from "react";

const getData = () => {
  try {
    const stored = localStorage.getItem("employeeData");
    if (stored) return JSON.parse(stored);
    return [];
  } catch (err) {
    console.error("Error reading data:", err);
    return [];
  }
};

const saveData = (data) => {
  try {
    localStorage.setItem("employeeData", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving data:", err);
  }
};

export default function Body() {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [age, setAge] = useState("");
  const [id, setId] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const isFirstRender = useRef(true);

  useEffect(() => {
    const initial = getData();
    setData(initial);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveData(data);
  }, [data]);

  const validateInputs = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z]+$/;

    if (firstName.trim() === "") {
      errors.firstName = "First name is required.";
    } else if (!nameRegex.test(firstName)) {
      errors.firstName = "First name should only contain letters.";
    }

    if (lastName.trim() === "") {
      errors.lastName = "Last name is required.";
    } else if (!nameRegex.test(lastName)) {
      errors.lastName = "Last name should only contain letters.";
    }
    if (email.trim() === "") {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Enter a valid email address.";
      }
    }

    if (!age || age <= 0) {
      errors.age = "Valid age is required.";
    }
    if (!gender) {
      errors.gender = "Please select a gender.";
    }

    if (hobbies.length === 0) {
      errors.hobbies = "Select at least one hobby.";
    }

    const phoneRegex = /^\d{10}$/;
    if (phone.trim() === "") {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }
    if (address.trim() === "") {
      errors.address = "Address is required.";
    } else if (address.length < 5) {
      errors.address = "Address should be at least 5 characters long.";
    }

    return errors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const nextId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const newRecord = {
      id: nextId,
      firstName,
      lastName,
      email,
      age: parseInt(age, 10),
      gender,
      hobbies,
      phone,
      address,
    };

    setData([...data, newRecord]);
    handleClear();
  };

  const handleEdit = (recordId) => {
    const record = data.find((r) => r.id === recordId);
    if (!record) return;
    setFirstName(record.firstName);
    setLastName(record.lastName);
    setAge(record.age);
    setId(record.id);
    setIsUpdate(true);
    setFormErrors({});
    setEmail(record.email);
    setGender(record.gender || "");
    setHobbies(record.hobbies || []);
    setPhone(record.phone || "");
    setAddress(record.address || "");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const updated = data.map((r) =>
      r.id === id
        ? {
            ...r,
            firstName,
            lastName,
            age: parseInt(age, 10),
            email,
            gender,
            hobbies,
            phone,
            address,
          }
        : r
    );

    setData(updated);
    handleClear();
  };

  const handleDelete = (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setData(data.filter((r) => r.id !== recordId));
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setId(0);
    setIsUpdate(false);
    setFormErrors({});
    setEmail("");
    setGender("");
    setHobbies([]);
    setPhone("");
    setAddress("");
  };
  return (
    <div className="Body">
      <div className="form-container">
        <h2 className="form-title">Employee Form</h2>
        <form onSubmit={isUpdate ? handleUpdate : handleSave}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              value={firstName}
              type="text"
              placeholder="Enter First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            {formErrors.firstName && (
              <div className="error-message">{formErrors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              value={lastName}
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
            {formErrors.lastName && (
              <div className="error-message">{formErrors.lastName}</div>
            )}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              value={email}
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              value={age}
              type="number"
              placeholder="Enter Age"
              onChange={(e) => setAge(e.target.value)}
            />
            {formErrors.age && (
              <div className="error-message">{formErrors.age}</div>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              value={phone}
              type="text"
              placeholder="Enter Phone Number"
              onChange={(e) => setPhone(e.target.value)}
            />
            {formErrors.phone && (
              <div className="error-message">{formErrors.phone}</div>
            )}
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Other
              </label>
            </div>
            {formErrors.gender && (
              <div className="error-message">{formErrors.gender}</div>
            )}
          </div>

          <div className="form-group">
            <label>Hobbies:</label>
            <div>
              {["Reading", "Traveling", "Gaming", "Cooking"].map((hobby) => (
                <label key={hobby}>
                  <input
                    type="checkbox"
                    value={hobby}
                    checked={hobbies.includes(hobby)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHobbies((prev) =>
                        checked
                          ? [...prev, hobby]
                          : prev.filter((h) => h !== hobby)
                      );
                    }}
                  />
                  {hobby}
                </label>
              ))}
            </div>
            {formErrors.hobbies && (
              <div className="error-message">{formErrors.hobbies}</div>
            )}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              value={address}
              placeholder="Enter Address"
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
            />
            {formErrors.address && (
              <div className="error-message">{formErrors.address}</div>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {isUpdate ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <h3 className="table-title">Employee Database</h3>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            {/* <th>Sr No.</th> */}
            <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Hobbies</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={item.id}>
                {/* <td>{idx + 1}</td> */}
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>{item.gender}</td>
                <td>{item.hobbies?.join(", ")}</td>
                <td>{item.address}</td>

                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
