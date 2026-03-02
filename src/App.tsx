import { useState, useEffect, createContext, useContext } from 'react';
import { Department, GenerationStep, ProjectContent, ProjectDetails } from './types';
import { INITIAL_PROJECT_CONTENT } from './constants';
import Landing from './components/Landing';
import TopicGenerator from './components/TopicGenerator';
import ProjectForm from './components/ProjectForm';
import ProjectWriter from './components/ProjectWriter';
import ProjectReview from './components/ProjectReview';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Navigation from './components/Navigation';
import Support from './components/Support';
import ProjectEditor from './components/ProjectEditor';
import ProjectDefense from './components/ProjectDefense';
import Header from './components/Header';
import TopUp from './components/TopUp';
import NotificationsPage from './components/NotificationsPage';
import TransactionsPage from './components/TransactionsPage';
import PremiumModal from './components/PremiumModal';
import { AnimatePresence, motion } from 'framer-motion';
import { clientFetch } from './utils/api';

import Services from './components/Services';
import CGPACalculator from './components/CGPACalculator';
import AssignmentWriter from './components/AssignmentWriter';
import QuizWriter from './components/QuizWriter';
import PastQuestionGenerator from './components/PastQuestionGenerator';
import Paraphraser from './components/Paraphraser';
import CVBuilder from './components/CVBuilder';
import StudyTimetable from './components/StudyTimetable';
import ScholarshipFinder from './components/ScholarshipFinder';
import CarryoverCalculator from './components/CarryoverCalculator';
import SideHustleGenerator from './components/SideHustleGenerator';
import NoteSummarizer from './components/NoteSummarizer';
import JobFinder from './components/JobFinder';
import FoodBudgetPlanner from './components/FoodBudgetPlanner';
import ExamPredictor from './components/ExamPredictor';
import MemoryHackGenerator from './components/MemoryHackGenerator';
import PerfectExamAnswer from './components/PerfectExamAnswer';
import TextbookToQuestions from './components/TextbookToQuestions';
import CramSheetCreator from './components/CramSheetCreator';
import ContentCreationIdeas from './components/ContentCreationIdeas';
import BusinessDemandAnalyzer from './components/BusinessDemandAnalyzer';
import EmergencySurvivalPlanner from './components/EmergencySurvivalPlanner';
import SituationEscaper from './components/SituationEscaper';
import PresentationMaker from './components/PresentationMaker';
import CheapFoodFinder from './components/CheapFoodFinder';
import AccommodationFinder from './components/AccommodationFinder';
import SnapAndSolve from './components/SnapAndSolve';
import UploadAndSolve from './components/UploadAndSolve';
import ObjectIdentifier from './components/ObjectIdentifier';
import CGPACalculatorFile from './components/CGPACalculatorFile';
import EDU432QualityAssurance from './components/EDU432QualityAssurance';
import PlagiarismChecker from './components/PlagiarismChecker';
import ImageToPdf from './components/ImageToPdf';

import Tour from './components/Tour';

export const UserContext = createContext<any>(null);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [step, setStep] = useState<GenerationStep | 'home' | 'login' | 'signup' | 'dashboard' | 'admin' | 'support' | 'editor' | 'transactions' | 'defense' | 'services' | 'cgpa-calculator' | 'assignment-writer' | 'quiz-writer' | 'past-questions' | 'paraphraser' | 'cv-builder' | 'study-timetable' | 'scholarship-finder' | 'carryover-calculator' | 'side-hustle' | 'note-summarizer' | 'job-finder' | 'food-budget-planner' | 'exam-predictor' | 'memory-hack' | 'perfect-exam-answer' | 'textbook-to-questions' | 'cram-sheet-creator' | 'content-creation-ideas' | 'business-demand' | 'emergency-survival' | 'situation-escaper' | 'presentation-maker' | 'cheap-food-finder' | 'accommodation-finder' | 'snap-solve' | 'upload-solve' | 'object-identifier' | 'cgpa-calculator-file' | 'edu432-qa' | 'project-writer' | 'ai-image-generator' | 'consistent-character' | 'storyboard-animator' | 'plagiarism-checker' | 'image-to-pdf'>('home');
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if running in Gemini Preview environment
    const hostname = window.location.hostname;
    if (hostname.endsWith('.run.app')) {
      setIsBlocked(true);
    }
  }, []);

  const [details, setDetails] = useState<ProjectDetails>({
    // Student Info
    fullName: '',
    surname: '',
    firstName: '',
    middleName: '',
    regNo: '',
    department: '' as Department,
    faculty: 'EDUCATION',
    university: 'UNIVERSITY OF NIGERIA, NSUKKA',
    degreeProgramme: 'B.Sc. Ed',
    session: '2025/2026',
    submissionDate: 'JULY, 2024',
    appendixDate: 'JULY, 2024',
    appendixAddress: 'Department of Biology Education,\nFaculty of Education,\nUniversity of Nigeria, Nsukka.',

    // Project Info
    topic: '',
    researchType: '',
    studyLocation: '',
    population: '',
    sampleSize: '',
    samplingTechnique: '',
    objectives: '',
    researchQuestions: '',
    hypotheses: '',
    instruments: '',
    dataAnalysisMethod: '',

    // Supervisor Info
    supervisorName: '',
    supervisorTitle: '',
    headOfDepartment: '',
    deanOfFaculty: '',
    internalExaminer: '',
    externalExaminer: '',
    deanUniversityOfNigeriaNsukka: '',

    // Content
    researcherName: '',
    dedication: '',
    acknowledgement: '',
    date: new Date().getFullYear().toString(),
    abstractLength: '18 lines',

    // Controls
    generateQuestionnaire: true,
    generateDataTables: true,
    simulateData: true,
    testHypotheses: true,
    generateExcel: false,
    includeCitations: true,
    figureType: 'Bar Chart'
  });
  const [content, setContent] = useState<ProjectContent>(INITIAL_PROJECT_CONTENT);
  const [authLoading, setAuthLoading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectCost, setProjectCost] = useState({ credits: 1, naira: 10000 });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');
  const [isPremiumSession, setIsPremiumSession] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    
    // Fetch project cost settings
    clientFetch('/api/support/project-cost')
      .then(res => res.ok ? res.json() : { costInCredits: 1, creditValueNaira: 10000 })
      .then(data => setProjectCost({ credits: data.costInCredits, naira: data.creditValueNaira }))
      .catch(err => console.error('Failed to fetch project cost:', err));
  }, []);

  const fetchUser = async () => {
    try {
      console.log('App: Fetching user...');
      const token = localStorage.getItem('token');
      if (!token) return null;

      const res = await clientFetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error(`App: Fetch user failed (${res.status}):`, text.substring(0, 200));
        if (res.status === 401) localStorage.removeItem('token');
        return null;
      }

      const data = await res.json();
      if (data.user) {
        console.log('App: User updated:', data.user);
        setUser(data.user);
        return data.user;
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('App: Fetch user failed:', error);
      localStorage.removeItem('token');
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('App: Initializing auth...');
        const user = await fetchUser();
        if (user) {
          setStep(user.isAdmin ? 'admin' : 'landing');
        } else {
          console.log('App: No user found');
          setStep('home');
        }
      } catch (error) {
        console.error('App: Auth initialization failed:', error);
        localStorage.removeItem('token');
      } finally {
        console.log('App: Auth init complete, setting app ready');
        setIsAppReady(true);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Refresh every minute

      // Pre-fill details from user profile
      const nameParts = (user.fullName || '').trim().split(/\s+/);
      let firstName = '';
      let middleName = '';
      let surname = '';

      if (nameParts.length > 0) {
        if (nameParts.length === 1) {
          firstName = nameParts[0];
        } else if (nameParts.length === 2) {
          firstName = nameParts[0];
          surname = nameParts[1];
        } else {
          firstName = nameParts[0];
          surname = nameParts[nameParts.length - 1];
          middleName = nameParts.slice(1, -1).join(' ');
        }
      }

      setDetails(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        researcherName: user.fullName || prev.researcherName,
        department: user.department || prev.department,
        regNo: user.regNo || prev.regNo,
        firstName: firstName || prev.firstName,
        surname: surname || prev.surname,
        middleName: middleName || prev.middleName
      }));

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const fetchNotifications = async () => {
    try {
      const res = await clientFetch('/api/notifications');
      const contentType = res.headers.get("content-type");
      
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount((data.notifications || []).filter((n: any) => !n.read).length);
      } else {
        const text = await res.text();
        console.warn('App: Fetch notifications failed - non-JSON response:', text.substring(0, 100));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await clientFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleLogin = async (u: any) => {
    setAuthLoading(true);
    setUser(u);
    await fetchUser();
    setStep(u.isAdmin ? 'admin' : 'landing');
    setAuthLoading(false);
  };

  const handleSignup = async (u: any) => {
    setAuthLoading(true);
    setUser(u);
    await fetchUser();
    setStep('landing');
    setShowTour(true);
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setAuthLoading(true);
    setStep('home');
    localStorage.removeItem('token');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setAuthLoading(false);
  };

  const handleSaveProject = async (updatedProject: any) => {
    const res = await clientFetch(`/api/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: updatedProject.topic,
        content: updatedProject.content
      })
    });

    if (res.ok) {
      setStep('dashboard');
    } else {
      alert('Failed to save project. Please try again.');
    }
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Official Site Only</h1>
          <p className="text-slate-400">
            This application is no longer available in the Gemini preview environment. 
            Please visit the official hosted website on Netlify to access all features.
          </p>
          <div className="pt-4">
            <a 
              href="https://rtechsse.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all"
            >
              Go to Official Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout: handleLogout, notifications, unreadCount, markAsRead, fetchNotifications, fetchUser }}>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0f172a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-16 md:pb-0 transition-colors duration-300">
        {user && !['login', 'signup'].includes(step) && <Header onNavigate={setStep} />}

        
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Landing 
                onLogin={() => setStep('login')}
                onSignup={() => setStep('signup')}
                user={user}
                isPublic={true}
              />
            </motion.div>
          )}

          {authLoading && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {step === 'login' && <Login key="login" onLogin={handleLogin} onSignup={() => setStep('signup')} onBack={() => setStep('home')} />}
          {step === 'signup' && <Signup key="signup" onSignup={handleSignup} onLogin={() => setStep('login')} onBack={() => setStep('home')} />}
          
          {step === 'admin' && <AdminDashboard key="admin" />}
          
          {step === 'dashboard' && user && (
            <Dashboard 
              key="dashboard" 
              onBack={() => setStep('landing')} 
              onViewProject={(p) => {
                 setSelectedProject(p);
                 setStep('editor');
              }}
              onNavigate={setStep}
            />
          )}

          {step === 'topup' && <TopUp key="topup" onBack={() => setStep('dashboard')} />}
          {step === 'notifications' && <NotificationsPage key="notifications" onBack={() => setStep('dashboard')} />}
          {step === 'transactions' && <TransactionsPage key="transactions" onBack={() => setStep('dashboard')} />}

          {step === 'editor' && selectedProject && (
            <ProjectEditor
              key="editor"
              project={selectedProject}
              onBack={() => setStep('dashboard')}
              onSave={handleSaveProject}
              onNavigate={setStep}
            />
          )}

          {step === 'support' && <Support key="support" />}
          {step === 'services' && <Services onBack={() => setStep('landing')} onNavigate={setStep} />}
          {step === 'cgpa-calculator' && <CGPACalculator onBack={() => setStep('services')} />}
          {step === 'assignment-writer' && <AssignmentWriter onBack={() => setStep('services')} />}
          {step === 'quiz-writer' && <QuizWriter onBack={() => setStep('services')} />}
          {step === 'past-questions' && <PastQuestionGenerator onBack={() => setStep('services')} />}
          {step === 'paraphraser' && <Paraphraser onBack={() => setStep('services')} />}
          {step === 'cv-builder' && <CVBuilder onBack={() => setStep('services')} />}
          {step === 'study-timetable' && <StudyTimetable onBack={() => setStep('services')} />}
          {step === 'scholarship-finder' && <ScholarshipFinder onBack={() => setStep('services')} />}
          {step === 'carryover-calculator' && <CarryoverCalculator onBack={() => setStep('services')} />}
          {step === 'side-hustle' && <SideHustleGenerator onBack={() => setStep('services')} />}
          {step === 'note-summarizer' && <NoteSummarizer onBack={() => setStep('services')} />}
          {step === 'job-finder' && <JobFinder onBack={() => setStep('services')} />}
          {step === 'food-budget-planner' && <FoodBudgetPlanner onBack={() => setStep('services')} />}
          {step === 'exam-predictor' && <ExamPredictor onBack={() => setStep('services')} />}
          {step === 'memory-hack' && <MemoryHackGenerator onBack={() => setStep('services')} />}
          {step === 'perfect-exam-answer' && <PerfectExamAnswer onBack={() => setStep('services')} />}
          {step === 'textbook-to-questions' && <TextbookToQuestions onBack={() => setStep('services')} />}
          {step === 'cram-sheet-creator' && <CramSheetCreator onBack={() => setStep('services')} />}
          {step === 'content-creation-ideas' && <ContentCreationIdeas onBack={() => setStep('services')} />}
          {step === 'business-demand' && <BusinessDemandAnalyzer onBack={() => setStep('services')} />}
          {step === 'emergency-survival' && <EmergencySurvivalPlanner onBack={() => setStep('services')} />}
          {step === 'situation-escaper' && <SituationEscaper onBack={() => setStep('services')} />}
          {step === 'presentation-maker' && <PresentationMaker onBack={() => setStep('services')} />}
          {step === 'cheap-food-finder' && <CheapFoodFinder onBack={() => setStep('services')} />}
          {step === 'accommodation-finder' && <AccommodationFinder onBack={() => setStep('services')} />}
          {step === 'snap-solve' && <SnapAndSolve onBack={() => setStep('services')} />}
          {step === 'upload-solve' && <UploadAndSolve onBack={() => setStep('services')} />}
          {step === 'object-identifier' && <ObjectIdentifier onBack={() => setStep('services')} />}
          {step === 'cgpa-calculator-file' && <CGPACalculatorFile onBack={() => setStep('services')} />}
          {step === 'edu432-qa' && <EDU432QualityAssurance onBack={() => setStep('services')} />}
          {step === 'plagiarism-checker' && <PlagiarismChecker onBack={() => setStep('landing')} />}
          {step === 'image-to-pdf' && <ImageToPdf onBack={() => setStep('services')} />}

          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Landing 
                onStart={() => setStep('topic-selection')} 
                onWrite={() => setStep('details')}
                onDashboard={() => setStep('dashboard')}
                onDefense={() => setStep('defense')}
                onPlagiarismCheck={() => setStep('plagiarism-checker')}
                user={user}
                isPublic={false}
              />
            </motion.div>
          )}

          {step === 'defense' && user && (
            <ProjectDefense 
              key="defense"
              onBack={() => setStep('landing')}
              onNavigate={setStep}
            />
          )}
          
          {step === 'topic-selection' && (
            <TopicGenerator 
              key="topic"
              onSelectTopic={(topic, dept) => {
                setDetails(prev => ({ ...prev, topic, department: dept }));
                setStep('details');
              }}
              onBack={() => setStep('landing')}
            />
          )}

          {step === 'details' && (
            <ProjectForm
              key="details"
              details={details}
              onUpdateDetails={setDetails}
              onNext={async () => {
                const costInNaira = projectCost.credits * projectCost.naira;
                const hasCredits = (user?.project_credits || 0) >= projectCost.credits;
                const hasBalance = (user?.balance || 0) >= costInNaira;
                const isFreeAccess = user?.hasFreeAccess;

                if (isFreeAccess || hasCredits || hasBalance) {
                  setIsWriting(true);
                  try {
                    // Create project immediately to deduct credit and save draft
                    const res = await clientFetch('/api/projects', { 
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        topic: details.topic,
                        department: details.department,
                        details: details,
                        content: INITIAL_PROJECT_CONTENT,
                        is_premium_generated: false // This triggers the deduction in backend
                      })
                    });

                    if (res.ok) {
                       const project = await res.json();
                       await fetchUser();
                       setIsPremiumSession(true);
                       setSelectedProject(project);
                       setStep('writing');
                    } else {
                       setIsWriting(false);
                       const data = await res.json();
                       alert(data.error || 'Failed to start project generation');
                    }
                  } catch (e) {
                    setIsWriting(false);
                    console.error(e);
                    alert('Network error');
                  }
                } else {
                  setPremiumFeatureName('Project Generation');
                  setShowPremiumModal(true);
                }
              }}
              onBack={() => setStep('landing')}
              isWriting={isWriting}
            />
          )}

          {step === 'writing' && user && (
            <ProjectWriter
              key="writing"
              details={details}
              onContentGenerated={(newContent, project) => {
                setContent(newContent);
                if (project) setSelectedProject(project);
                setStep('review');
              }}
              onBack={() => setStep('details')}
              onNavigate={setStep}
              userId={user.id}
              projectId={selectedProject?.id}
            />
          )}

          {step === 'review' && (
            <ProjectReview
              key="review"
              details={details}
              content={content}
              project={selectedProject}
              onUpdateContent={setContent}
              onUpdateDetails={setDetails}
              onBack={() => setStep('writing')}
              onNavigate={setStep}
              isPremiumSession={isPremiumSession}
            />
          )}
        </AnimatePresence>

        {user && !['home', 'login', 'signup', 'admin'].includes(step) && (
          <Navigation currentStep={step} onNavigate={setStep} unreadCount={unreadCount} />
        )}

        <AnimatePresence>
          {showTour && <Tour onComplete={() => setShowTour(false)} />}
        </AnimatePresence>

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={() => {
            setShowPremiumModal(false);
            setStep('topup');
          }}
          featureName={premiumFeatureName}
        />
      </div>
    </UserContext.Provider>
  );
}
