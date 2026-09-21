import { useState } from 'react';
import {
  Users, BookOpen, CalendarCheck, FileText, ClipboardList, ClipboardEdit,
  Library, MessageSquare, GraduationCap, CheckCircle2, AlertCircle,
  Clock, Save, Send, Plus, Upload, FileSpreadsheet, Check, UsersRound,
} from 'lucide-react';
import { PageHeader, StatCard, SectionCard, EmptyState, Avatar, ProgressBar, Modal } from '@/components/ui';
import {
  CLASSES, SUBJECTS, STUDENTS, ASSESSMENTS, GRADES, ATTENDANCE, ANNOUNCEMENTS,
} from '@/data/mockData';
import type { Assessment, AttendanceRecord } from '@/types';
import { getTeacherClasses, getTeacherSubjects, getStudentsForClass, getAttendance, setAttendance, getGradebooks, setGradebooks, type WorkflowAttendance, type WorkflowGradebook } from '@/data/workflow';

// --- Teacher Dashboard ---
export function TeacherDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const myClasses = CLASSES;
  const mySubjects = SUBJECTS;
  const draftAssessments = ASSESSMENTS.filter((a) => a.status === 'draft');
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Teacher Dashboard" subtitle="Your classes, subjects, and teaching activities." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Classes" value={myClasses.length} icon={<Users className="w-5 h-5" />} />
        <StatCard label="My Subjects" value={mySubjects.length} icon={<BookOpen className="w-5 h-5" />} color="accent" />
        <StatCard label="My Students" value={STUDENTS.length} icon={<Users className="w-5 h-5" />} color="success" />
        <StatCard label="Draft Assessments" value={draftAssessments.length} icon={<ClipboardList className="w-5 h-5" />} color="warning" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="My Classes" action={<button onClick={() => onNavigate('classes')} className="btn-ghost text-sm">View All</button>}>
          <div className="space-y-3">
            {myClasses.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100">
                <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><Users className="w-4 h-4" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-navy-800">{c.name}</p><p className="text-xs text-navy-400">{c.studentCount} students — {c.room}</p></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Quick Actions">
          <div className="space-y-2">
            <button onClick={() => onNavigate('attendance')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-50 transition-colors text-left">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><CalendarCheck className="w-4 h-4" /></div>
              <span className="text-sm font-medium text-navy-700">Take Attendance</span>
            </button>
            <button onClick={() => onNavigate('gradebook')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-50 transition-colors text-left">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><ClipboardEdit className="w-4 h-4" /></div>
              <span className="text-sm font-medium text-navy-700">Open Gradebook</span>
            </button>
            <button onClick={() => onNavigate('assignments')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-50 transition-colors text-left">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><FileText className="w-4 h-4" /></div>
              <span className="text-sm font-medium text-navy-700">Create Assignment</span>
            </button>
            <button onClick={() => onNavigate('resources')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-50 transition-colors text-left">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><Library className="w-4 h-4" /></div>
              <span className="text-sm font-medium text-navy-700">Upload Resources</span>
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export function TeacherClasses() {
  const classes = getTeacherClasses('u6');
  return <div className="space-y-6 animate-fade-in"><PageHeader title="My Classes" subtitle="Only classes currently assigned to you by the Vice Principal." /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{classes.map(c=><div key={c.id} className="card-hover p-5"><div className="p-3 rounded-xl bg-navy-100 text-navy-700 w-fit mb-3"><Users className="w-5 h-5" /></div><h3 className="font-semibold text-navy-800">{c.grade}{c.section}</h3><p className="text-sm text-navy-400 mt-1">{c.studentCount} students — {c.room}</p><div className="mt-3"><ProgressBar value={c.studentCount} max={35}/></div></div>)}</div></div>;
}

export function TeacherSubjects() {
  const subjects = getTeacherSubjects('u6');
  return <div className="space-y-6 animate-fade-in"><PageHeader title="My Subjects" subtitle="Subjects assigned to you by the school." /><SectionCard title="Subjects"><table className="table-base"><thead><tr><th>Subject</th><th>Code</th><th>Class</th></tr></thead><tbody>{subjects.map(s=><tr key={s.id}><td className="font-medium text-navy-800">{s.name}</td><td>{s.code}</td><td>{s.className}</td></tr>)}</tbody></table></SectionCard></div>;
}

export function TeacherStudents() {
  const subjects = getTeacherSubjects('u6');
  const classIds = Array.from(new Set(subjects.map(s => s.classId)));
  const classes = getTeacherClasses('u6').filter(c => classIds.includes(c.id) || getTeacherClasses('u6').some(x => x.id === c.id));
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const students = selectedClass ? getStudentsForClass(selectedClass) : [];
  return <div className="space-y-6 animate-fade-in"><PageHeader title="My Students" subtitle="Select a class to quickly view every student in the classes and subjects you teach." /><div className="max-w-md"><label className="label">Class / Section</label><select className="input" value={selectedClass} onChange={e=>setSelectedClass(e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.grade}{c.section} — {c.name}</option>)}</select></div><SectionCard title={`Students (${students.length})`}><table className="table-base"><thead><tr><th>Student</th><th>Grade</th><th>Class</th><th>Roll No</th><th>Guardian</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><div className="flex items-center gap-2"><Avatar name={s.name} color={s.photoColor} size="sm"/><span className="font-medium text-navy-800">{s.name}</span></div></td><td>{s.grade}</td><td>{s.class}</td><td>{s.rollNo}</td><td>{s.guardianName}</td></tr>)}</tbody></table></SectionCard></div>;
}

export function TeacherAttendance() {
  const classes = getTeacherClasses('u6');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [session, setSession] = useState<'morning'|'afternoon'|'evening'>('morning');
  const [records, setRecords] = useState<WorkflowAttendance[]>(getAttendance());
  const students = selectedClass ? getStudentsForClass(selectedClass) : [];
  const today = new Date().toISOString().slice(0,10);
  const existing = records.filter(r => r.classId === selectedClass && r.date === today && r.session === session);
  const [status, setStatus] = useState<Record<string, WorkflowAttendance['status']>>(() => Object.fromEntries(existing.map(r=>[r.studentId,r.status])));
  const setAll = (value: WorkflowAttendance['status']) => setStatus(Object.fromEntries(students.map(s=>[s.id,value])));
  const saveNow = () => {
    const assignment = classes.find(c=>c.id===selectedClass);
    if (!assignment) return;
    const kept = records.filter(r => !(r.classId===selectedClass && r.date===today && r.session===session));
    const next = students.map(s => ({ id:`att-${today}-${selectedClass}-${session}-${s.id}`, studentId:s.id, studentName:s.name, classId:selectedClass, className:`${assignment.grade}${assignment.section}`, date:today, status:status[s.id] || 'present', session, recordedBy:'u6', sponsorId:'u6', sponsorName:'Mr. Peter Wleh', submittedAt:new Date().toISOString() } as WorkflowAttendance));
    const all=[...kept,...next]; setRecords(all); setAttendance(all); window.alert('Attendance saved and sent to the Principal and Vice Principal.');
  };
  return <div className="space-y-6 animate-fade-in"><PageHeader title="Attendance" subtitle="The assigned class sponsor is the only teacher allowed to submit attendance for that class and session." action={<button onClick={saveNow} className="btn-primary"><Save className="w-4 h-4"/> Save Attendance</button>}/><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="label">Class</label><select className="input" value={selectedClass} onChange={e=>{setSelectedClass(e.target.value);setStatus({});}}>{classes.map(c=><option key={c.id} value={c.id}>{c.grade}{c.section} — {c.name}</option>)}</select></div><div><label className="label">Session</label><select className="input" value={session} onChange={e=>{setSession(e.target.value as any);setStatus({});}}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></div></div><SectionCard title={`${classes.find(c=>c.id===selectedClass)?.grade}${classes.find(c=>c.id===selectedClass)?.section} — ${session} — ${today}`} action={<div className="flex gap-2"><button className="btn-secondary text-xs" onClick={()=>setAll('present')}>Mark All Present</button><button className="btn-secondary text-xs" onClick={()=>setAll('absent')}>Mark All Absent</button></div>}><div className="space-y-2">{students.map(s=>{const v=status[s.id]||'present';return <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100"><Avatar name={s.name} color={s.photoColor} size="sm"/><span className="text-sm font-medium text-navy-800 flex-1">{s.name}</span><div className="flex flex-wrap gap-1"><button onClick={()=>setStatus(p=>({...p,[s.id]:'present'}))} className={v==='present'?'badge-success':'btn-secondary text-xs'}>Present</button><button onClick={()=>setStatus(p=>({...p,[s.id]:'absent'}))} className={v==='absent'?'badge-error':'btn-secondary text-xs'}>Absent</button><button onClick={()=>setStatus(p=>({...p,[s.id]:'excused'}))} className={v==='excused'?'badge-info':'btn-secondary text-xs'}>Excuse</button><button onClick={()=>setStatus(p=>({...p,[s.id]:'late'}))} className={v==='late'?'badge-warning':'btn-secondary text-xs'}>Late</button></div></div>})}</div></SectionCard></div>;
}

export function TeacherAssignments() {
  const [showCreate, setShowCreate] = useState(false);
  const [assessments, setAssessments] = useState(ASSESSMENTS);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Assignments" subtitle="Create and manage assignments." action={<button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> New Assignment</button>} />
      <SectionCard title="My Assignments">
        <table className="table-base">
          <thead><tr><th>Title</th><th>Type</th><th>Subject</th><th>Class</th><th>Date</th><th>Total Marks</th><th>Status</th></tr></thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td className="font-medium text-navy-800">{a.title}</td>
                <td><span className="badge-info">{a.type}</span></td>
                <td>{a.subjectName}</td><td>{a.className}</td><td>{a.date}</td><td>{a.totalMarks}</td>
                <td><span className={a.status === 'graded' ? 'badge-success' : a.status === 'published' ? 'badge-info' : 'badge-warning'}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
      {showCreate && <CreateAssessmentModal onClose={() => setShowCreate(false)} onCreate={(a) => { setAssessments((prev) => [a, ...prev]); setShowCreate(false); }} />}
    </div>
  );
}

function CreateAssessmentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Assessment) => void }) {
  const [form, setForm] = useState({ title: '', type: 'assignment' as Assessment['type'], subjectId: 'sub1', classId: 'c5', totalMarks: '20', date: '2026-09-21' });
  const subject = SUBJECTS.find((s) => s.id === form.subjectId);
  const cls = CLASSES.find((c) => c.id === form.classId);
  return (
    <Modal open={true} onClose={onClose} title="Create Assignment">
      <div className="space-y-4">
        <div><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Assessment['type'] })}>
              {['assignment', 'quiz', 'test', 'participation', 'midterm', 'final'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="label">Total Marks</label><input type="number" className="input" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Subject</label>
            <select className="input" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.className}</option>)}
            </select>
          </div>
          <div><label className="label">Class</label>
            <select className="input" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => {
            if (!form.title.trim()) return;
            onCreate({
              id: `a${Date.now()}`, title: form.title, type: form.type,
              subjectId: form.subjectId, subjectName: subject?.name || '', classId: form.classId, className: cls?.name || '',
              date: form.date, totalMarks: parseInt(form.totalMarks) || 20, status: 'draft',
            });
          }} className="btn-primary">Create</button>
        </div>
      </div>
    </Modal>
  );
}

export function TeacherAssessments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Assessments" subtitle="All assessment components." />
      <SectionCard title="Assessment Components">
        <table className="table-base">
          <thead><tr><th>Title</th><th>Type</th><th>Subject</th><th>Class</th><th>Marks</th><th>Status</th></tr></thead>
          <tbody>
            {ASSESSMENTS.map((a) => (
              <tr key={a.id}>
                <td className="font-medium text-navy-800">{a.title}</td>
                <td><span className="badge-info">{a.type}</span></td>
                <td>{a.subjectName}</td><td>{a.className}</td><td>{a.totalMarks}</td>
                <td><span className={a.status === 'graded' ? 'badge-success' : a.status === 'published' ? 'badge-info' : 'badge-warning'}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

export function TeacherGradebook() {
  const classes = getTeacherClasses('u6');
  const subjects = getTeacherSubjects('u6');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const classSubjects = subjects.filter(s=>s.classId===selectedClass);
  const [selectedSubject, setSelectedSubject] = useState(classSubjects[0]?.id || '');
  const [session, setSession] = useState<'morning'|'afternoon'|'evening'>('morning');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const submit = async () => {
    if (!file || !selectedClass || !selectedSubject) return;
    const cls=classes.find(c=>c.id===selectedClass); const sub=subjects.find(s=>s.id===selectedSubject); if(!cls||!sub) return;
    const current=getGradebooks();
    const fileDataUrl=file.size <= 2_500_000 ? await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file);}) : undefined;
    const submission: WorkflowGradebook={id:`gs-${Date.now()}`,teacherName:'Mr. Peter Wleh',teacherId:'u6',subjectName:sub.name,subjectId:sub.id,className:`${cls.grade}${cls.section}`,classId:cls.id,term:'First Term 2026/2027',submittedDate:new Date().toISOString().slice(0,10),status:'submitted',studentCount:getStudentsForClass(cls.id).length,session,fileName:file.name,fileSize:file.size,fileType:file.type || 'Excel workbook',fileDataUrl};
    setGradebooks([submission,...current]); setSubmitted(true); setFile(null);
  };
  return <div className="space-y-6 animate-fade-in"><PageHeader title="Gradebook Submission" subtitle="Select the class, subject, session, then upload the prepared Excel gradebook. It is sent directly to the Principal for review."/><SectionCard title="Submission Details"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="label">Class</label><select className="input" value={selectedClass} onChange={e=>{setSelectedClass(e.target.value);setSelectedSubject('');}}>{classes.map(c=><option key={c.id} value={c.id}>{c.grade}{c.section}</option>)}</select></div><div><label className="label">Subject</label><select className="input" value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)}>{classSubjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div><label className="label">Class Session</label><select className="input" value={session} onChange={e=>setSession(e.target.value as any)}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></div></div><div className="mt-5"><label className="label">Gradebook file</label><label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-navy-200 rounded-xl hover:bg-navy-50 cursor-pointer"><Upload className="w-7 h-7 text-navy-500"/><span className="text-sm font-medium text-navy-700">Choose Excel gradebook</span><span className="text-xs text-navy-400">.xlsx, .xls, .csv — prepared gradebook from your computer</span><input type="file" className="hidden" accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>{file&&<div className="mt-3 p-3 rounded-lg bg-navy-50 flex items-center gap-3"><FileSpreadsheet className="w-5 h-5 text-navy-600"/><div className="flex-1"><p className="text-sm font-medium text-navy-800">{file.name}</p><p className="text-xs text-navy-400">{Math.round(file.size/1024)} KB</p></div><button onClick={()=>setFile(null)} className="text-navy-400 hover:text-error-600">×</button></div>}</div><div className="flex justify-end mt-5"><button onClick={submit} disabled={!file||!selectedSubject} className="btn-primary disabled:opacity-50"><Send className="w-4 h-4"/> Submit Grades</button></div>{submitted&&<div className="mt-4 p-3 rounded-lg bg-success-50 border border-success-200 text-sm text-success-700"><CheckCircle2 className="inline w-4 h-4 mr-2"/> Gradebook submitted successfully. The Principal can now view, approve, or reject it.</div>}</SectionCard></div>;
}

export function TeacherResources() {
  const [showUpload, setShowUpload] = useState(false);
  const [resources, setResources] = useState([
    { name: 'Algebra Notes — Chapter 1', subject: 'Mathematics', type: 'PDF', date: '2026-09-10' },
    { name: 'Physics Lab Manual', subject: 'Physics', type: 'PDF', date: '2026-09-08' },
    { name: 'Equations Worksheet', subject: 'Mathematics', type: 'DOC', date: '2026-09-12' },
    { name: "Newton's Laws Slides", subject: 'Physics', type: 'PPT', date: '2026-09-07' },
  ]);
  const [form, setForm] = useState({ name: '', subject: 'Mathematics', type: 'PDF' });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Learning Resources" subtitle="Upload and share learning materials." action={<button onClick={() => setShowUpload(true)} className="btn-primary"><Plus className="w-4 h-4" /> Upload Resource</button>} />
      <SectionCard title="My Resources">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <div key={i} className="card-hover p-5">
              <div className="p-3 rounded-xl bg-navy-100 text-navy-700 w-fit mb-3"><FileText className="w-5 h-5" /></div>
              <h3 className="font-semibold text-navy-800 text-sm">{r.name}</h3>
              <p className="text-xs text-navy-400 mt-1">{r.subject} — {r.type} — {r.date}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      {showUpload && (
        <Modal open={true} onClose={() => setShowUpload(false)} title="Upload Resource">
          <div className="space-y-4">
            <div><label className="label">Resource Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chapter 5 Notes" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Subject</label>
                <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label">File Type</label>
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {['PDF', 'DOC', 'PPT', 'IMG', 'VIDEO'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-2 border-dashed border-navy-200 rounded-lg text-center">
              <FileText className="w-8 h-8 text-navy-400 mx-auto mb-2" />
              <p className="text-sm text-navy-500">Drag and drop a file here, or click to browse</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => {
                if (!form.name.trim()) return;
                setResources((prev) => [{ name: form.name, subject: form.subject, type: form.type, date: new Date().toISOString().split('T')[0] }, ...prev]);
                setShowUpload(false);
                setForm({ name: '', subject: 'Mathematics', type: 'PDF' });
              }} className="btn-primary">Upload</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function TeacherMessages() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Messages & Announcements" subtitle="Communicate with students and parents." />
      <SectionCard title="Recent Messages">
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((an) => (
            <div key={an.id} className="p-4 rounded-lg border border-navy-100">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-navy-800 text-sm">{an.title}</h3>
                <span className="text-xs text-navy-400">{an.date}</span>
              </div>
              <p className="text-sm text-navy-600">{an.body}</p>
              <p className="text-xs text-navy-400 mt-2">— {an.author}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// --- Counselor ---
export function CounselorDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Guidance Counselor Dashboard" subtitle="Student support and counseling." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Cases" value="4" icon={<AlertCircle className="w-5 h-5" />} color="warning" />
        <StatCard label="At-Risk Students" value="3" icon={<AlertCircle className="w-5 h-5" />} color="error" />
        <StatCard label="Sessions This Week" value="7" icon={<CheckCircle2 className="w-5 h-5" />} color="success" />
        <StatCard label="Follow-ups Due" value="2" icon={<Clock className="w-5 h-5" />} color="navy" />
      </div>
      <SectionCard title="Active Support Cases" action={<button onClick={() => onNavigate('cases')} className="btn-ghost text-sm">View All</button>}>
        <div className="space-y-3">
          {[
            { student: 'Augustine T. Kollie', category: 'Behavioral', status: 'In Progress', date: '2026-09-19' },
            { student: 'Daniel S. Tuah', category: 'Academic', status: 'Follow-up', date: '2026-09-10' },
            { student: 'Mohammed S. Kromah', category: 'Social', status: 'Open', date: '2026-09-17' },
            { student: 'Esther L. Barclay', category: 'Family', status: 'In Progress', date: '2026-09-05' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><AlertCircle className="w-4 h-4" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-navy-800">{c.student}</p><p className="text-xs text-navy-400">{c.category} — Opened: {c.date}</p></div>
              <span className={c.status === 'Open' ? 'badge-error' : c.status === 'In Progress' ? 'badge-warning' : 'badge-info'}>{c.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function CounselorCases() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Support Cases" subtitle="Active student support and counseling cases." />
      <SectionCard title="All Cases">
        <table className="table-base">
          <thead><tr><th>Student</th><th>Category</th><th>Status</th><th>Opened</th><th>Last Session</th><th>Confidential</th></tr></thead>
          <tbody>
            {[
              { student: 'Augustine T. Kollie', category: 'Behavioral', status: 'In Progress', opened: '2026-09-19', last: '2026-09-20', confidential: true },
              { student: 'Daniel S. Tuah', category: 'Academic', status: 'Follow-up', opened: '2026-09-10', last: '2026-09-18', confidential: true },
              { student: 'Mohammed S. Kromah', category: 'Social', status: 'Open', opened: '2026-09-17', last: '—', confidential: true },
              { student: 'Esther L. Barclay', category: 'Family', status: 'In Progress', opened: '2026-09-05', last: '2026-09-16', confidential: true },
            ].map((c, i) => (
              <tr key={i}>
                <td className="font-medium text-navy-800">{c.student}</td>
                <td><span className="badge-info">{c.category}</span></td>
                <td><span className={c.status === 'Open' ? 'badge-error' : c.status === 'In Progress' ? 'badge-warning' : 'badge-info'}>{c.status}</span></td>
                <td>{c.opened}</td><td>{c.last}</td>
                <td>{c.confidential ? <span className="badge-error">Confidential</span> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

export function CounselorAtRisk() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="At-Risk Students" subtitle="Students identified as at-risk." />
      <SectionCard title="At-Risk Students">
        <div className="space-y-3">
          {[
            { name: 'Augustine T. Kollie', grade: 'Grade 10A', reason: 'Behavioral concerns', risk: 'Moderate' },
            { name: 'Daniel S. Tuah', grade: 'Grade 9A', reason: 'Academic decline', risk: 'Moderate' },
            { name: 'Mohammed S. Kromah', grade: 'Grade 8B', reason: 'Social conflict', risk: 'High' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100">
              <Avatar name={s.name} color="bg-error-500" size="sm" />
              <div className="flex-1"><p className="text-sm font-medium text-navy-800">{s.name}</p><p className="text-xs text-navy-400">{s.grade} — {s.reason}</p></div>
              <span className={s.risk === 'High' ? 'badge-error' : 'badge-warning'}>{s.risk} Risk</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function CounselorInterventions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Intervention Records" subtitle="Recorded interventions and support actions." />
      <SectionCard title="Interventions">
        <div className="space-y-3">
          {[
            { student: 'Augustine T. Kollie', intervention: 'Behavioral counseling session', date: '2026-09-20', outcome: 'Ongoing' },
            { student: 'Daniel S. Tuah', intervention: 'Academic support plan', date: '2026-09-18', outcome: 'Improving' },
            { student: 'Esther L. Barclay', intervention: 'Family support referral', date: '2026-09-16', outcome: 'Ongoing' },
          ].map((iv, i) => (
            <div key={i} className="p-4 rounded-lg border border-navy-100">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-navy-800">{iv.student}</p><p className="text-xs text-navy-400 mt-1">{iv.intervention} — {iv.date}</p></div>
                <span className={iv.outcome === 'Improving' ? 'badge-success' : 'badge-warning'}>{iv.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function CounselorFollowUps() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Follow-up Activities" subtitle="Scheduled follow-up sessions." />
      <SectionCard title="Upcoming Follow-ups">
        <div className="space-y-3">
          {[
            { student: 'Augustine T. Kollie', activity: 'Follow-up counseling session', date: '2026-09-24', time: '10:00 AM' },
            { student: 'Esther L. Barclay', activity: 'Family support check-in', date: '2026-09-25', time: '2:00 PM' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700"><Clock className="w-4 h-4" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-navy-800">{f.student}</p><p className="text-xs text-navy-400">{f.activity} — {f.date} at {f.time}</p></div>
              <span className="badge-info">Scheduled</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
