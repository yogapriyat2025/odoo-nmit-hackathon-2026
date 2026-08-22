import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard, UserRound, CalendarCheck, CalendarDays, Wallet,
  FileText, Users, ClipboardCheck, BarChart3, Bell, LogOut,
  Menu, X, Clock3, CheckCircle2, XCircle, Plus, Search
} from "lucide-react";

const employees = [
  { id: "EMP001", name: "Arun Kumar", department: "Engineering", role: "Developer", status: "Present" },
  { id: "EMP002", name: "Priya S", department: "HR", role: "HR Officer", status: "Present" },
  { id: "EMP003", name: "Karthik M", department: "Finance", role: "Accountant", status: "Leave" },
  { id: "EMP004", name: "Divya R", department: "Engineering", role: "Developer", status: "Absent" }
];

function getRole() {
  return localStorage.getItem("dayflow_role") || "employee";
}
function isLogged() {
  return localStorage.getItem("dayflow_logged") === "true";
}

function Protected({ children, adminOnly = false }) {
  if (!isLogged()) return <Navigate to="/login" replace />;
  if (adminOnly && getRole() !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }
    localStorage.setItem("dayflow_logged", "true");
    localStorage.setItem("dayflow_role", role);
    nav("/dashboard");
  }

  return <div className="auth-page">
    <div className="auth-card">
      <div className="brand-mark">D</div>
      <h1>Welcome to Dayflow</h1>
      <p className="muted">Human Resource Management System</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        <label>Login as</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin / HR</option>
        </select>
        <button className="primary full">Sign In</button>
      </form>
      <p className="hint">Demo frontend: any non-empty email/password works.</p>
    </div>
  </div>;
}

function Sidebar({ open, close }) {
  const admin = getRole() === "admin";
  const links = admin ? [
    ["/dashboard","Dashboard",LayoutDashboard],
    ["/employees","Employees",Users],
    ["/attendance","Attendance",CalendarCheck],
    ["/leave-approvals","Leave Approvals",ClipboardCheck],
    ["/payroll","Payroll",Wallet],
    ["/reports","Reports",BarChart3]
  ] : [
    ["/dashboard","Dashboard",LayoutDashboard],
    ["/profile","My Profile",UserRound],
    ["/attendance","Attendance",CalendarCheck],
    ["/leave","Leave",CalendarDays],
    ["/payroll","Payroll",Wallet],
    ["/documents","Documents",FileText]
  ];

  return <aside className={"sidebar " + (open ? "open" : "")}>
    <div className="side-head"><div className="brand-mark small">D</div><strong>DAYFLOW</strong><button className="icon-btn mobile-only" onClick={close}><X/></button></div>
    <nav>{links.map(([to,label,Icon]) =>
      <NavLink key={to} to={to} onClick={close} className={({isActive})=>isActive?"active":""}><Icon size={19}/><span>{label}</span></NavLink>
    )}</nav>
    <div className="side-bottom">
      <div className="mini-profile"><div className="avatar">JD</div><div><b>{admin?"HR Admin":"John Doe"}</b><small>{admin?"HR Officer":"Employee"}</small></div></div>
      <button className="logout" onClick={()=>{localStorage.clear();location.href="/login"}}><LogOut size={18}/> Logout</button>
    </div>
  </aside>;
}

function Header({ onMenu }) {
  return <header className="topbar">
    <button className="icon-btn mobile-only" onClick={onMenu}><Menu/></button>
    <div><b>{getRole()==="admin" ? "Admin Portal" : "Employee Portal"}</b><span className="top-sub"> · Every workday, perfectly aligned.</span></div>
    <div className="top-actions"><button className="icon-btn"><Bell size={19}/><i></i></button><div className="avatar">JD</div></div>
  </header>;
}

function Layout({ children }) {
  const [open,setOpen] = useState(false);
  return <div className="app-shell"><Sidebar open={open} close={()=>setOpen(false)}/><div className="main"><Header onMenu={()=>setOpen(true)}/><main className="content">{children}</main></div></div>;
}

function Stat({icon:Icon,label,value,note}) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={21}/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
}

function EmployeeDashboard() {
  return <Layout>
    <div className="page-title"><div><h2>Good morning, John 👋</h2><p>Here’s your workday overview.</p></div><span className="date-pill">Saturday, Aug 22, 2026</span></div>
    <div className="stats">
      <Stat icon={CheckCircle2} label="Attendance" value="22 Days" note="This month"/>
      <Stat icon={CalendarDays} label="Leave Balance" value="12 Days" note="Remaining"/>
      <Stat icon={Clock3} label="Working Hours" value="168h" note="This month"/>
      <Stat icon={Wallet} label="Net Salary" value="₹42,500" note="August payroll"/>
    </div>
    <div className="grid-2">
      <section className="card attendance-card">
        <div className="card-head"><div><h3>Today's Attendance</h3><p>Saturday, August 22</p></div><span className="status success">● Present</span></div>
        <div className="time-row"><div><small>Check In</small><b>09:05 AM</b></div><div><small>Working Time</small><b>04:18 hrs</b></div><div><small>Check Out</small><b>--:--</b></div></div>
        <button className="primary">Check Out</button>
      </section>
      <section className="card">
        <div className="card-head"><div><h3>Recent Leave Requests</h3><p>Your latest requests</p></div><NavLink to="/leave" className="text-link">View all</NavLink></div>
        <LeaveRow type="Sick Leave" date="Aug 20 – Aug 21" status="Approved"/>
        <LeaveRow type="Paid Leave" date="Aug 28" status="Pending"/>
        <LeaveRow type="Unpaid Leave" date="Jul 11" status="Rejected"/>
      </section>
    </div>
    <section className="card"><div className="card-head"><div><h3>Recent Activity</h3><p>Latest updates on your account</p></div></div>
      <div className="activity"><CheckCircle2/><div><b>Attendance marked</b><span>Today at 09:05 AM</span></div></div>
      <div className="activity"><CalendarDays/><div><b>Paid leave request submitted</b><span>Yesterday at 04:32 PM</span></div></div>
      <div className="activity"><Wallet/><div><b>August payslip generated</b><span>Aug 20, 2026</span></div></div>
    </section>
  </Layout>;
}

function AdminDashboard() {
  return <Layout>
    <div className="page-title"><div><h2>HR Dashboard</h2><p>Monitor your workforce at a glance.</p></div><button className="primary"><Plus size={17}/> Add Employee</button></div>
    <div className="stats">
      <Stat icon={Users} label="Total Employees" value="128" note="+6 this month"/>
      <Stat icon={CheckCircle2} label="Present Today" value="114" note="89.1% attendance"/>
      <Stat icon={CalendarDays} label="Pending Leaves" value="09" note="Needs approval"/>
      <Stat icon={Wallet} label="Payroll" value="₹54.2L" note="August"/>
    </div>
    <div className="grid-2">
      <section className="card"><div className="card-head"><div><h3>Today's Attendance</h3><p>Workforce status</p></div><NavLink to="/attendance" className="text-link">View details</NavLink></div>
        <div className="progress-list"><Progress label="Present" value="89.1%" percent={89}/><Progress label="On Leave" value="7.0%" percent={7}/><Progress label="Absent" value="3.9%" percent={4}/></div>
      </section>
      <section className="card"><div className="card-head"><div><h3>Leave Approvals</h3><p>Requests waiting for action</p></div><NavLink to="/leave-approvals" className="text-link">View all</NavLink></div>
        <LeaveRow type="Sick Leave · Arun Kumar" date="Aug 22 – Aug 23" status="Pending"/>
        <LeaveRow type="Paid Leave · Divya R" date="Aug 25" status="Pending"/>
        <LeaveRow type="Unpaid Leave · Karthik M" date="Aug 29" status="Pending"/>
      </section>
    </div>
    <section className="card"><div className="card-head"><div><h3>Employees</h3><p>Recently active employees</p></div><NavLink to="/employees" className="text-link">Manage employees</NavLink></div><EmployeeTable data={employees.slice(0,4)}/></section>
  </Layout>;
}

function LeaveRow({type,date,status}) {
  return <div className="leave-row"><div className="leave-dot"></div><div><b>{type}</b><span>{date}</span></div><span className={"status "+status.toLowerCase()}>{status}</span></div>;
}
function Progress({label,value,percent}) {
  return <div className="progress"><div><span>{label}</span><b>{value}</b></div><div className="bar"><i style={{width:percent+"%"}}></i></div></div>;
}
function EmployeeTable({data}) {
  return <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Status</th></tr></thead><tbody>{data.map(e=><tr key={e.id}><td><div className="person"><div className="avatar">{e.name.split(" ").map(x=>x[0]).join("")}</div><div><b>{e.name}</b><small>{e.id}</small></div></div></td><td>{e.department}</td><td>{e.role}</td><td><span className={"status "+e.status.toLowerCase()}>{e.status}</span></td></tr>)}</tbody></table></div>;
}

function Profile() {
  return <Layout><Title title="My Profile" sub="View and manage your personal information."/><section className="card profile"><div className="profile-top"><div className="profile-avatar">JD</div><div><h3>John Doe</h3><p>Software Developer · Engineering</p><span className="status success">Active Employee</span></div><button className="secondary">Edit Profile</button></div><div className="detail-grid"><Detail label="Employee ID" value="EMP001"/><Detail label="Email" value="john.doe@dayflow.com"/><Detail label="Phone" value="+91 98765 43210"/><Detail label="Department" value="Engineering"/><Detail label="Joining Date" value="12 Jan 2024"/><Detail label="Manager" value="Priya S"/></div></section><section className="card"><h3>Salary Structure</h3><div className="salary-grid"><Detail label="Basic Salary" value="₹30,000"/><Detail label="HRA" value="₹12,000"/><Detail label="Allowances" value="₹6,500"/><Detail label="Net Salary" value="₹42,500"/></div></section></Layout>;
}
function Detail({label,value}) { return <div className="detail"><small>{label}</small><b>{value}</b></div>; }
function Title({title,sub,action}) { return <div className="page-title"><div><h2>{title}</h2><p>{sub}</p></div>{action}</div>; }

function Attendance() {
  const admin=getRole()==="admin";
  return <Layout><Title title="Attendance" sub={admin?"Monitor attendance across all employees.":"Track your daily and weekly attendance."}/><div className="toolbar"><div className="search"><Search size={17}/><input placeholder={admin?"Search employees...":"Search attendance..."}/></div><select><option>August 2026</option><option>July 2026</option></select><button className="secondary">Weekly View</button></div><section className="card"><div className="table-wrap"><table><thead><tr><th>Date</th>{admin&&<th>Employee</th>}<th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>{[
    ["Aug 22, 2026","John Doe","09:05 AM","--:--","04:18","Present"],["Aug 21, 2026","John Doe","09:02 AM","06:04 PM","09:02","Present"],["Aug 20, 2026","John Doe","09:14 AM","01:00 PM","03:46","Half-day"],["Aug 19, 2026","John Doe","--","--","--","Leave"],["Aug 18, 2026","John Doe","09:08 AM","06:12 PM","09:04","Present"]
    ].map((r,i)=><tr key={i}><td>{r[0]}</td>{admin&&<td>{r[1]}</td>}<td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><span className={"status "+r[5].toLowerCase().replace("-","")}>{r[5]}</span></td></tr>)}</tbody></table></div></section></Layout>;
}

function Leave() {
  const [show,setShow]=useState(false);
  return <Layout><Title title="Leave & Time-Off" sub="Apply for leave and track your requests." action={<button className="primary" onClick={()=>setShow(true)}><Plus size={17}/> Apply Leave</button>}/><div className="stats"><Stat icon={CalendarDays} label="Paid Leave" value="8 Days" note="Available"/><Stat icon={CalendarDays} label="Sick Leave" value="4 Days" note="Available"/><Stat icon={CalendarDays} label="Used" value="6 Days" note="This year"/></div><section className="card"><div className="card-head"><div><h3>My Leave Requests</h3><p>History of your leave applications</p></div></div><table><thead><tr><th>Leave Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead><tbody><tr><td>Sick Leave</td><td>Aug 20 – Aug 21</td><td>2</td><td>Not feeling well</td><td><span className="status approved">Approved</span></td></tr><tr><td>Paid Leave</td><td>Aug 28</td><td>1</td><td>Personal work</td><td><span className="status pending">Pending</span></td></tr><tr><td>Unpaid Leave</td><td>Jul 11</td><td>1</td><td>Personal</td><td><span className="status rejected">Rejected</span></td></tr></tbody></table></section>{show&&<LeaveModal close={()=>setShow(false)}/>}</Layout>;
}
function LeaveModal({close}) { return <div className="modal-bg"><div className="modal"><div className="card-head"><h3>Apply for Leave</h3><button className="icon-btn" onClick={close}><X/></button></div><label>Leave Type</label><select><option>Paid Leave</option><option>Sick Leave</option><option>Unpaid Leave</option></select><label>From</label><input type="date"/><label>To</label><input type="date"/><label>Remarks</label><textarea placeholder="Reason for leave"></textarea><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Submit Request</button></div></div></div>; }

function Employees() {
  const [q,setQ]=useState("");
  const filtered=employees.filter(e=>(e.name+" "+e.department+" "+e.id).toLowerCase().includes(q.toLowerCase()));
  return <Layout><Title title="Employee Management" sub="Manage employee profiles and workforce information." action={<button className="primary"><Plus size={17}/> Add Employee</button>}/><div className="toolbar"><div className="search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, ID or department..."/></div><select><option>All Departments</option><option>Engineering</option><option>HR</option><option>Finance</option></select></div><section className="card"><EmployeeTable data={filtered}/></section></Layout>;
}

function LeaveApprovals() {
  return <Layout><Title title="Leave Approvals" sub="Review and process employee leave requests."/><section className="card"><table><thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Action</th></tr></thead><tbody>{["Arun Kumar","Divya R","Karthik M"].map((n,i)=><tr key={n}><td><b>{n}</b><small>EMP00{i+1}</small></td><td>{i===0?"Sick":"Paid"} Leave</td><td>Aug {22+i} – Aug {23+i}</td><td>2</td><td>Personal / health</td><td><div className="actions"><button className="approve"><CheckCircle2 size={17}/></button><button className="reject"><XCircle size={17}/></button></div></td></tr>)}</tbody></table></section></Layout>;
}

function Payroll() {
  const admin=getRole()==="admin";
  return <Layout><Title title="Payroll" sub={admin?"View and manage salary structures.":"Your salary and payslip information."} action={<button className="secondary"><FileText size={17}/> Download Payslip</button>}/><div className="stats"><Stat icon={Wallet} label="Gross Salary" value="₹48,500" note="Monthly"/><Stat icon={Wallet} label="Deductions" value="₹6,000" note="Monthly"/><Stat icon={Wallet} label="Net Salary" value="₹42,500" note="August 2026"/><Stat icon={CheckCircle2} label="Payroll Status" value="Processed" note="Aug 2026"/></div><section className="card"><div className="card-head"><div><h3>{admin?"Employee Payroll":"Salary Breakdown"}</h3><p>{admin?"Current month payroll records":"August 2026 salary structure"}</p></div></div>{admin?<EmployeeTable data={employees}/>:<div className="salary-grid"><Detail label="Basic" value="₹30,000"/><Detail label="HRA" value="₹12,000"/><Detail label="Transport" value="₹3,000"/><Detail label="Other Allowances" value="₹3,500"/><Detail label="PF" value="-₹3,600"/><Detail label="Tax" value="-₹2,400"/></div>}</section></Layout>;
}

function Documents() { return <Layout><Title title="Documents" sub="Access your HR documents and payslips."/><section className="card"><div className="doc"><FileText/><div><b>August 2026 Salary Slip</b><span>Generated Aug 20, 2026 · PDF</span></div><button className="secondary">View</button></div><div className="doc"><FileText/><div><b>Employment Contract</b><span>Uploaded Jan 12, 2024 · PDF</span></div><button className="secondary">View</button></div><div className="doc"><FileText/><div><b>Employee ID Document</b><span>Uploaded Jan 12, 2024 · PDF</span></div><button className="secondary">View</button></div></section></Layout>; }

function Reports() { return <Layout><Title title="Reports & Analytics" sub="Workforce insights and HR reports."/><div className="stats"><Stat icon={Users} label="Headcount" value="128" note="+4.9% growth"/><Stat icon={CheckCircle2} label="Attendance Rate" value="89.1%" note="This month"/><Stat icon={CalendarDays} label="Leave Rate" value="7.0%" note="This month"/><Stat icon={Wallet} label="Payroll Cost" value="₹54.2L" note="August"/></div><section className="card chart"><h3>Attendance Overview</h3><div className="bars">{[70,84,76,91,88,95,89].map((v,i)=><div key={i}><i style={{height:v+"%"}}></i><small>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</small></div>)}</div></section></Layout>; }

function App() {
  return <Routes>
    <Route path="/login" element={isLogged()?<Navigate to="/dashboard"/>:<Login/>}/>
    <Route path="/dashboard" element={<Protected>{getRole()==="admin"?<AdminDashboard/>:<EmployeeDashboard/>}</Protected>}/>
    <Route path="/profile" element={<Protected><Profile/></Protected>}/>
    <Route path="/attendance" element={<Protected><Attendance/></Protected>}/>
    <Route path="/leave" element={<Protected><Leave/></Protected>}/>
    <Route path="/payroll" element={<Protected><Payroll/></Protected>}/>
    <Route path="/documents" element={<Protected><Documents/></Protected>}/>
    <Route path="/employees" element={<Protected adminOnly><Employees/></Protected>}/>
    <Route path="/leave-approvals" element={<Protected adminOnly><LeaveApprovals/></Protected>}/>
    <Route path="/reports" element={<Protected adminOnly><Reports/></Protected>}/>
    <Route path="*" element={<Navigate to={isLogged()?"/dashboard":"/login"} replace/>}/>
  </Routes>;
}

export default App;