const ErrorHandler = require("../utils/error-handler");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");
const mongoose = require("mongoose");
const crypto = require("crypto");
const teamService = require("../services/team-service");
const attendanceService = require("../services/attendance-service");

class UserController {
  createUser = async (req, res, next) => {
    const file = req.file;
    let { name, email, password, type, address, mobile } = req.body;
    const username = "user" + crypto.randomInt(11111111, 999999999);
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !type ||
      !address ||
      !file ||
      !mobile
    )
      return next(ErrorHandler.badRequest("All Fields Required"));
    type = type.toLowerCase();
    if (type === "admin") {
      const adminPassword = req.body.adminPassword;
      if (!adminPassword)
        return next(
          ErrorHandler.badRequest(
            `Please Enter Your Password to Add ${name} as an Admin`
          )
        );
      const { _id } = req.user;
      const { password: hashPassword } = await userService.findUser({ _id });
      const isPasswordValid = await userService.verifyPassword(
        adminPassword,
        hashPassword
      );
      if (!isPasswordValid)
        return next(
          ErrorHandler.unAuthorized("You have entered a wrong password")
        );
    }
    const user = {
      name,
      email,
      username,
      mobile,
      password,
      type,
      address,
      image: file.filename,
    };

    // console.log("Hello! I am here in create user");
    // console.log(user)

    const userResp = await userService.createUser(user);

    if (!userResp)
      return next(ErrorHandler.serverError("Failed To Create An Account"));
    res.json({
      success: true,
      message: "User has been Added",
      user: new UserDto(user),
    });
  };

  updateUser = async (req, res, next) => {
    try {
      let {
        name,
        username,
        email,
        password,
        type,
        status,
        address,
        mobile,
        adminPassword,
      } = req.body;
      const file = req.file;
      const filename = file ? file.filename : null;
      let id = req.user._id; // Default: user updating their own profile
      let userData;

      console.log(req.user.type);

      if (req.user.type === "admin") {
        id = req.params.id; // Admin can update other users

        if (!mongoose.Types.ObjectId.isValid(id))
          return next(ErrorHandler.badRequest("Invalid User Id"));

        const dbUser = await userService.findUser({ _id: id });
        if (!dbUser) return next(ErrorHandler.badRequest("No User Found"));

        if (type) {
          type = type.toLowerCase();

          if (dbUser.type !== type) {
            if (req.user._id.toString() === id)
              return next(
                ErrorHandler.badRequest(`You Can't Change Your Own Position`)
              );

            if (!adminPassword)
              return next(
                ErrorHandler.badRequest(
                  `Please Enter Your Password To Change The Type`
                )
              );

            const adminUser = await userService.findUser({ _id: req.user._id });
            const isPasswordValid = await userService.verifyPassword(
              adminPassword,
              adminUser.password
            );

            if (!isPasswordValid)
              return next(
                ErrorHandler.unAuthorized("You have entered a wrong password")
              );

            // Ensure proper transitions between roles
            if (
              dbUser.type === "employee" &&
              (type === "admin" || type === "leader") &&
              dbUser.team
            )
              return next(
                ErrorHandler.badRequest(`Error: ${dbUser.name} is in a team.`)
              );

            if (
              dbUser.type === "leader" &&
              (type === "admin" || type === "employee")
            ) {
              const isLeadingTeam = await teamService.findTeam({ leader: id });
              if (isLeadingTeam)
                return next(
                  ErrorHandler.badRequest(
                    `Error: ${dbUser.name} is leading a team.`
                  )
                );
            }
          }
        }

        userData = {
          name,
          email,
          status,
          username,
          mobile,
          password,
          type,
          address,
        };
      } else {
        // Normal user updating their own profile
        userData = { name, username, mobile, address };
      }

      // Only update image if a new one is uploaded
      if (filename) {
        userData.image = filename;
      }

      const updatedUser = await userService.updateUser(id, userData);
      if (!updatedUser)
        return next(ErrorHandler.serverError("Failed to update account"));

      res.json({ success: true, message: "Account Updated" });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req, res, next) => {
    const type = req.path.split("/").pop().replace("s", "");
    const emps = await userService.findUsers({ type });
    if (!emps || emps.length < 1)
      return next(
        ErrorHandler.notFound(
          `No ${
            type.charAt(0).toUpperCase() + type.slice(1).replace(" ", "")
          } Found`
        )
      );
    const employees = emps.map((o) => new UserDto(o));
    res.json({
      success: true,
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1).replace(" ", "")
      } List Found`,
      data: employees,
    });
  };

  getFreeEmployees = async (req, res, next) => {
    const emps = await userService.findUsers({ type: "employee", team: null });
    if (!emps || emps.length < 1)
      return next(ErrorHandler.notFound(`No Free Employee Found`));
    const employees = emps.map((o) => new UserDto(o));
    res.json({
      success: true,
      message: "Free Employees List Found",
      data: employees,
    });
  };

  getUser = async (req, res, next) => {
    const { id } = req.params;
    const type = req.path.replace(id, "").replace("/", "").replace("/", "");
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(
        ErrorHandler.badRequest(
          `Invalid ${
            type.charAt(0).toUpperCase() + type.slice(1).replace(" ", "")
          } Id`
        )
      );
    const emp = await userService.findUser({ _id: id, type });
    if (!emp)
      return next(
        ErrorHandler.notFound(
          `No ${
            type.charAt(0).toUpperCase() + type.slice(1).replace(" ", "")
          } Found`
        )
      );
    res.json({
      success: true,
      message: "Employee Found",
      data: new UserDto(emp),
    });
  };

  getUserNoFilter = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(ErrorHandler.badRequest("Invalid User Id"));
    const emp = await userService.findUser({ _id: id });
    if (!emp) return next(ErrorHandler.notFound("No User Found"));
    res.json({ success: true, message: "User Found", data: new UserDto(emp) });
  };

  getLeaders = async (req, res, next) => {
    const leaders = await userService.findLeaders();
    const data = leaders.map((o) => new UserDto(o));
    res.json({ success: true, message: "Leaders Found", data });
  };

  getFreeLeaders = async (req, res, next) => {
    const leaders = await userService.findFreeLeaders();
    const data = leaders.map((o) => new UserDto(o));
    res.json({ success: true, message: "Free Leaders Found", data });
  };

  markEmployeeAttendance = async (req, res, next) => {
    try {
      const { employeeID, present=true } = req.body;
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const d = new Date();

      // const {_id} = employee;

      const newAttendance = {
        employeeID,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        day: days[d.getDay()],
        present,
      };

      const isAttendanceMarked = await attendanceService.findAttendance(
        newAttendance
      );
      if (isAttendanceMarked)
        return next(
          ErrorHandler.notAllowed(
            d.toLocaleDateString() +
              " " +
              days[d.getDay() - 1] +
              " " +
              "Attendance Already Marked!"
          )
        );

      const resp = await attendanceService.markAttendance(newAttendance);
      console.log(resp);
      if (!resp)
        return next(ErrorHandler.serverError("Failed to mark attendance"));
      const statusText = present ? "Marked as Present" : "Marked as Absent";
      const msg =
        d.toLocaleDateString() +
        " " +
        days[d.getDay()] +
        " " +
        statusText + "!";

      res.json({ success: true, newAttendance, message: msg });
    } catch (error) {
      res.json({ success: false, error });
    }
  };

  viewEmployeeAttendance = async (req, res, next) => {
    try {
      const data = req.body;
      const resp = await attendanceService.findAllAttendance(data);
      if (!resp) return next(ErrorHandler.notFound("No Attendance found"));

      res.json({ success: true, data: resp });
    } catch (error) {
      res.json({ success: false, error });
    }
  };

  applyLeaveApplication = async (req, res, next) => {
    try {
      const data = req.body;
      const {
        applicantID,
        title,
        type,
        startDate,
        endDate,
        appliedDate,
        period,
        reason,
      } = data;
      const newLeaveApplication = {
        applicantID,
        title,
        type,
        startDate,
        endDate,
        appliedDate,
        period,
        reason,
        adminResponse: "Pending",
      };

      const isLeaveApplied = await userService.findLeaveApplication({
        applicantID,
        startDate,
        endDate,
        appliedDate,
      });
      if (isLeaveApplied)
        return next(ErrorHandler.notAllowed("Leave Already Applied"));

      const resp = await userService.createLeaveApplication(
        newLeaveApplication
      );
      if (!resp) return next(ErrorHandler.serverError("Failed to apply leave"));

      res.json({ success: true, data: resp });
    } catch (error) {
      res.json({ success: false, error });
    }
  };

  viewLeaveApplications = async (req, res, next) => {
    try {
      const data = req.body;
      const resp = await userService.findAllLeaveApplications(data);
      if (!resp)
        return next(ErrorHandler.notFound("No Leave Applications found"));

      res.json({ success: true, data: resp });
    } catch (error) {
      res.json({ success: false, error });
    }
  };

  updateLeaveApplication = async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const isLeaveUpdated = await userService.updateLeaveApplication(id, body);
      if (!isLeaveUpdated)
        return next(ErrorHandler.serverError("Failed to update leave"));
      res.json({ success: true, message: "Leave Updated" });
    } catch (error) {
      res.json({ success: false, error });
    }
  };

  //changed for each month assignment
  // assignEmployeeSalary = async (req, res, next) => { 
  //   try {
  //     const data = req.body;
  //     const { employeeID } = data;
  
  //     if (!employeeID)
  //       return next(ErrorHandler.badRequest("Employee ID is required"));
  
  //     const isSalaryAssigned = await userService.findSalaryForCurrentMonth(employeeID);
  
  //     if (isSalaryAssigned)
  //       return next(ErrorHandler.serverError("Salary already assigned for this month"));
  
  //     const today = new Date();
  //     data["assignedDate"] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
  //     const resp = await userService.assignSalary(data);
  
  //     if (!resp)
  //       return next(ErrorHandler.serverError("Failed to assign salary"));
  
  //     res.json({ success: true, data: resp });
  
  //   } catch (error) {
  //     res.json({ success: false, error });
  //   }
  // };

  // changed for new fields in assign salary
  assignEmployeeSalary = async (req, res, next) => { 
    try {
      const data = req.body;
      const { employeeID } = data;
  
      if (!employeeID)
        return next(ErrorHandler.badRequest("Employee ID is required"));
  
      const isSalaryAssigned = await userService.findSalaryForCurrentMonth(employeeID);
  
      if (isSalaryAssigned)
        return next(ErrorHandler.serverError("Salary already assigned for this month"));
  
      const today = new Date();
      data.assignedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
      // Auto-calculation
      const grossSalary = parseFloat(data.grossSalary);
      const bonus = parseFloat(data.bonus || 0);
  
      if (isNaN(grossSalary) || grossSalary <= 0) {
        return next(ErrorHandler.badRequest("Invalid gross salary value"));
      }
  
      // Adjusted to 50% for basic salary
      const basicSalary = +(grossSalary * 0.6).toFixed(2);
      const dearnessAllowance = +(grossSalary * 0.2).toFixed(2);
  
      // Adjusted SSF to 11% of basic salary
      const providentFund = +(basicSalary * 0.10).toFixed(2);
      const socialSecurityFund = +(basicSalary * 0.11).toFixed(2); // Adjusted SSF percentage
      const totalDeductions = +(providentFund + socialSecurityFund).toFixed(2);
  
      const netSalary = +(grossSalary + bonus - totalDeductions).toFixed(2);
  
      // Set calculated fields
      data.basicSalary = basicSalary;
      data.dearnessAllowance = dearnessAllowance;
      data.providentFund = providentFund;
      data.socialSecurityFund = socialSecurityFund;
      data.totalDeductions = totalDeductions;
      data.netSalary = netSalary;
  
      const resp = await userService.assignSalary(data);
  
      if (!resp)
        return next(ErrorHandler.serverError("Failed to assign salary"));
  
      res.json({ success: true, data: resp });
  
    } catch (error) {
      res.json({ success: false, error });
    }
  };
  
  
  updateEmployeeSalary = async (req, res, next) => {
    try {
      const body = req.body;
      const {
        employeeID,
        grossSalary,
        bonus,
        reasonForBonus,
        assignedDate,
        basicSalary,
        dearnessAllowance,
        providentFund,
        socialSecurityFund,
        totalDeductions,
        netSalary,
      } = body;
  
      // Create an update object that will be used to update the salary details
      const salaryData = {
        grossSalary,
        bonus,
        reasonForBonus,
        assignedDate,
        basicSalary,
        dearnessAllowance,
        providentFund,
        socialSecurityFund,
        totalDeductions,
        netSalary,  // Add calculated fields here
      };
  
      // Update salary in the database
      const isSalaryUpdated = await userService.updateSalary(
        { employeeID },
        salaryData
      );
  
      if (!isSalaryUpdated)
        return next(ErrorHandler.serverError("Failed to update salary"));
  
      res.json({ success: true, message: "Salary Updated" });
    } catch (error) {
      res.json({ success: false, error });
    }
  };
  
  
  viewSalary = async (req, res, next) => {
    try {
      const data = req.body;
      const resp = await userService.findAllSalary(data);
      if (!resp) return next(ErrorHandler.notFound("No Salary Found"));
      res.json({ success: true, data: resp });
    } catch (error) {
      res.json({ success: false, error });
    }
  };
}

module.exports = new UserController();
