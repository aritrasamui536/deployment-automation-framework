import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FrameworksSection from "./components/FrameworksSection";
import PipelineSection from "./components/PipelineSection";
import CompareSection from "./components/CompareSection";
import DocsSection from "./components/DocsSection";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Toast, { useToast } from "./components/Toast";
import BackToTop from "./components/BackToTop";
import Login from "./components/Login";
import Register from "./components/Register";
import NewDeploymentForm from "./components/NewDeploymentForm";
import DeploymentDetail from "./components/DeploymentDetail";
import Logs from "./components/Logs";

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [logsDeployment, setLogsDeployment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveSection("hero");
  };

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const renderContent = () => {
    switch (activeSection) {
      case "frameworks": return <FrameworksSection />;
      case "pipeline":   return <PipelineSection />;
      case "compare":    return <CompareSection />;
      case "docs":       return <DocsSection />;
      case "logs":       return user ? (
        <Logs
          deploymentId={logsDeployment?._id || null}
          deploymentName={logsDeployment?.app || null}
        />
      ) : <Login setUser={setUser} setActiveSection={setActiveSection} />;
      case "dashboard":  return user ? (
        <Dashboard
          key={refreshKey}
          addToast={addToast}
          onNewDeployment={() => setShowNewForm(true)}
          onViewDeployment={(d) => setSelectedDeployment(d)}
          onViewLogs={(d) => { setLogsDeployment(d); setActiveSection("logs"); }}
        />
      ) : <Login setUser={setUser} setActiveSection={setActiveSection} />;
      case "login":      return <Login setUser={setUser} setActiveSection={setActiveSection} />;
      case "register":   return <Register setUser={setUser} setActiveSection={setActiveSection} />;
      default:           return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        handleLogout={handleLogout}
      />
      <main style={{ flex: 1, paddingTop: "60px" }}>
        {renderContent()}
      </main>
      <Footer />
      <Toast toasts={toasts} />
      <BackToTop />
      {showNewForm && (
        <NewDeploymentForm
          onClose={() => setShowNewForm(false)}
          onCreated={triggerRefresh}
          addToast={addToast}
        />
      )}
      {selectedDeployment && (
        <DeploymentDetail
          deployment={selectedDeployment}
          onClose={() => setSelectedDeployment(null)}
          onDeleted={triggerRefresh}
          addToast={addToast}
          onViewLogs={(d) => { setSelectedDeployment(null); setLogsDeployment(d); setActiveSection("logs"); }}
        />
      )}
    </div>
  );
}
export default App;
