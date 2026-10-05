import React, { useState, useMemo } from 'react';
import { useHostel } from '../context/HostelContext';
import { RoommatePreferences } from '../types';
import { 
  Lock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  HeartHandshake, 
  Sliders, 
  Check, 
  X,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const RoommateMatching: React.FC = () => {
  const { 
    currentStudent, 
    rooms, 
    roommateRequests, 
    sendRoommateRequest, 
    respondToRoommateRequest, 
    updateStudentPreferences,
    setActiveView 
  } = useHostel();

  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [prefForm, setPrefForm] = useState<RoommatePreferences>(
    currentStudent.preferences || {
      sleepPreference: 'Flexible',
      studyPreference: 'Quiet',
      cleanliness: 'Very tidy',
      socialPreference: 'Balanced',
      smokingPreference: 'Non-smoker',
      interests: ['Tech', 'Coding', 'Football'],
    }
  );

  const availableInterests = [
    'Tech & Coding',
    'Football',
    'Gaming & PS5',
    'Music Production',
    'Reading & Books',
    'Fitness & Gym',
    'Fashion & Design',
    'Entrepreneurship',
    'Movies & Anime',
    'Photography',
  ];

  // GATEKEEPER CHECK: Locked if student has not paid
  if (!currentStudent.hasPaid) {
    return (
      <section className="py-20 bg-[#F4EFE7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="bg-white rounded-2xl border border-[#A1927D]/50 p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#5B514B]/10 text-[#5B514B] flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#2A2827]" />
            </div>

            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
              Verified Student Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2827] tracking-tight mb-3">
              Roommate Matching is Reserved for Confirmed Students
            </h2>
            <p className="text-sm text-[#5B514B] leading-relaxed max-w-lg mx-auto mb-8">
              To guarantee physical safety, accountability, and genuine compatibility, roommate 
              discovery unlocks exclusively after your Mushia Hostel room payment has been successfully verified.
            </p>

            <div className="p-4 bg-[#F4EFE7]/80 rounded-xl border border-[#A1927D]/40 text-xs text-[#5B514B] max-w-md mx-auto mb-8 text-left space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Only 100% confirmed paid room occupants appear</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mutual match algorithm based on sleep, study & lifestyle habits</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct phone & WhatsApp contact exchanged upon mutual acceptance</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('rooms')}
              className="px-8 py-3.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Available Rooms & Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>
    );
  }

  // Find candidate roommates:
  // Confirmed students who share the same room OR same floor
  const assignedRoom = rooms.find((r) => r.id === currentStudent.roomId || r.roomNumber === currentStudent.roomNumber);

  // Other students who have paid
  const candidateStudents = useMemo(() => {
    const list: {
      studentId: string;
      name: string;
      program: string;
      level: string;
      gender: 'Male' | 'Female';
      roomId: string;
      roomNumber: string;
      spaceNumber: number;
      isSameRoom: boolean;
      preferences: RoommatePreferences;
      matchScore: number;
    }[] = [];

    rooms.forEach((r) => {
      r.spaces.forEach((s) => {
        if (s.status === 'paid' && s.studentId && s.studentId !== currentStudent.knustId) {
          const isSameRoom = r.roomNumber === currentStudent.roomNumber;
          
          // Generate realistic mock lifestyle preferences for other students
          const studentPrefs: RoommatePreferences = {
            sleepPreference: s.spaceNumber % 2 === 0 ? 'Early sleeper' : 'Flexible',
            studyPreference: s.spaceNumber % 3 === 0 ? 'Quiet' : 'Occasional discussion',
            cleanliness: 'Very tidy',
            socialPreference: s.spaceNumber % 2 === 0 ? 'Balanced' : 'Social',
            smokingPreference: 'Non-smoker',
            interests: ['Football', 'Tech & Coding', 'Gaming & PS5'],
          };

          // Compatibility Algorithm (#27)
          let matchPoints = 65; // base score
          const userPrefs = currentStudent.preferences || prefForm;

          if (userPrefs.sleepPreference === studentPrefs.sleepPreference) matchPoints += 10;
          if (userPrefs.studyPreference === studentPrefs.studyPreference) matchPoints += 10;
          if (userPrefs.cleanliness === studentPrefs.cleanliness) matchPoints += 8;
          if (userPrefs.smokingPreference === studentPrefs.smokingPreference) matchPoints += 7;

          const sharedInterests = userPrefs.interests.filter((i) => studentPrefs.interests.includes(i));
          matchPoints += Math.min(10, sharedInterests.length * 3);

          const finalScore = Math.min(98, Math.max(70, matchPoints));

          list.push({
            studentId: s.studentId,
            name: s.studentName ? `${s.studentName.split(' ')[0]} ${s.studentName.split(' ')[1]?.[0] || ''}.` : 'Student',
            program: s.studentProgram || 'BSc Student',
            level: s.studentLevel || 'Level 200',
            gender: s.gender || 'Male',
            roomId: r.id,
            roomNumber: r.roomNumber,
            spaceNumber: s.spaceNumber,
            isSameRoom,
            preferences: studentPrefs,
            matchScore: finalScore,
          });
        }
      });
    });

    // Sort by same room first, then highest compatibility
    return list.sort((a, b) => {
      if (a.isSameRoom && !b.isSameRoom) return -1;
      if (!a.isSameRoom && b.isSameRoom) return 1;
      return b.matchScore - a.matchScore;
    });
  }, [rooms, currentStudent, prefForm]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentPreferences(prefForm);
    setIsEditingPreferences(false);
  };

  const toggleInterest = (interest: string) => {
    if (prefForm.interests.includes(interest)) {
      setPrefForm({
        ...prefForm,
        interests: prefForm.interests.filter((i) => i !== interest),
      });
    } else {
      setPrefForm({
        ...prefForm,
        interests: [...prefForm.interests, interest],
      });
    }
  };

  return (
    <section className="py-16 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#A1927D]/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Roommate Discovery Unlocked</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#2A2827] tracking-tight">
              Connect With Your Mushia Roommates
            </h2>
            <p className="text-xs sm:text-sm text-[#5B514B] mt-1">
              Currently assigned to <strong>Room {currentStudent.roomNumber} (Space #{currentStudent.spaceNumber})</strong>.
              Connect with fellow students who have confirmed bookings.
            </p>
          </div>

          <button
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            className="mt-4 md:mt-0 px-4 py-2 bg-white border border-[#A1927D] hover:bg-[#EAE3D9] text-[#2A2827] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEditingPreferences ? 'Close Preferences' : 'Edit My Habits & Interests'}</span>
          </button>
        </div>

        {/* Questionnaire Preferences Drawer */}
        {isEditingPreferences && (
          <div className="bg-white rounded-2xl border border-[#A1927D]/50 p-6 mb-8 shadow-sm">
            <h3 className="font-bold text-base text-[#2A2827] mb-1">My Lifestyle & Study Questionnaire</h3>
            <p className="text-xs text-[#7D6E66] mb-6">
              Our algorithm uses these criteria to calculate percentage match scores with other confirmed students.
            </p>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* Sleep Schedule */}
                <div>
                  <label className="block font-bold text-[#7D6E66] uppercase mb-1.5">Sleep Schedule</label>
                  <select
                    value={prefForm.sleepPreference}
                    onChange={(e) => setPrefForm({ ...prefForm, sleepPreference: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-[#2A2827] focus:outline-none"
                  >
                    <option value="Early sleeper">Early sleeper (Sleeps before 11 PM)</option>
                    <option value="Late sleeper">Late sleeper (Night owl / Late study)</option>
                    <option value="Flexible">Flexible schedule</option>
                  </select>
                </div>

                {/* Study Style */}
                <div>
                  <label className="block font-bold text-[#7D6E66] uppercase mb-1.5">Study Style</label>
                  <select
                    value={prefForm.studyPreference}
                    onChange={(e) => setPrefForm({ ...prefForm, studyPreference: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-[#2A2827] focus:outline-none"
                  >
                    <option value="Quiet">Quiet (Prefers absolute silence in room)</option>
                    <option value="Occasional discussion">Occasional academic discussion</option>
                    <option value="Social">Social study atmosphere</option>
                  </select>
                </div>

                {/* Cleanliness */}
                <div>
                  <label className="block font-bold text-[#7D6E66] uppercase mb-1.5">Cleanliness Standard</label>
                  <select
                    value={prefForm.cleanliness}
                    onChange={(e) => setPrefForm({ ...prefForm, cleanliness: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-[#2A2827] focus:outline-none"
                  >
                    <option value="Very tidy">Very tidy (Neat & organized daily)</option>
                    <option value="Moderately tidy">Moderately tidy</option>
                    <option value="Flexible">Flexible approach</option>
                  </select>
                </div>

                {/* Social Preference */}
                <div>
                  <label className="block font-bold text-[#7D6E66] uppercase mb-1.5">Room Social Vibe</label>
                  <select
                    value={prefForm.socialPreference}
                    onChange={(e) => setPrefForm({ ...prefForm, socialPreference: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-[#2A2827] focus:outline-none"
                  >
                    <option value="Private">Private (Keep to myself)</option>
                    <option value="Balanced">Balanced (Friendly & respectful)</option>
                    <option value="Social">Social (Enjoys lively company)</option>
                  </select>
                </div>

                {/* Smoking */}
                <div>
                  <label className="block font-bold text-[#7D6E66] uppercase mb-1.5">Smoking / Vaping</label>
                  <select
                    value={prefForm.smokingPreference}
                    onChange={(e) => setPrefForm({ ...prefForm, smokingPreference: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-[#2A2827] focus:outline-none"
                  >
                    <option value="Non-smoker">Non-smoker (Hostel standard)</option>
                    <option value="Smoker">Smoker</option>
                  </select>
                </div>

              </div>

              {/* Interests Multi-Select */}
              <div>
                <label className="block font-bold text-xs text-[#7D6E66] uppercase mb-2">Interests & Hobbies</label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => {
                    const isSelected = prefForm.interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2A2827] text-[#FEFB58] shadow-sm'
                            : 'bg-[#F4EFE7] text-[#5B514B] hover:bg-[#EAE3D9]'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#A1927D]/30">
                <button
                  type="button"
                  onClick={() => setIsEditingPreferences(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5B514B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Save Questionnaire
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Roommate Requests & Connections */}
        {roommateRequests.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7D6E66] mb-3">
              Roommate Invitations & Active Connections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roommateRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-[#A1927D]/50 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-[#2A2827] block">
                        {req.senderName} ↔ {req.receiverName}
                      </span>
                      <span className="text-xs text-[#7D6E66]">
                        Room {req.roomNumber} · {req.senderProgram} ({req.senderLevel})
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status === 'accepted' ? 'Connected' : req.status === 'declined' ? 'Declined' : 'Pending'}
                    </span>
                  </div>

                  {req.status === 'accepted' ? (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Roommate Connected! Contact info unlocked:</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-700 pt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          <span>{req.contactPhone || '+233 24 551 2309'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{req.contactEmail || 'student@st.knust.edu.gh'}</span>
                        </span>
                      </div>
                    </div>
                  ) : req.status === 'pending' && req.receiverId === currentStudent.knustId ? (
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => respondToRoommateRequest(req.id, 'declined')}
                        className="px-3 py-1.5 border border-zinc-300 text-xs font-semibold rounded-lg text-zinc-600 hover:bg-zinc-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => respondToRoommateRequest(req.id, 'accepted')}
                        className="px-4 py-1.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] text-xs font-bold rounded-lg shadow-sm"
                      >
                        Accept Roommate
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#7D6E66] mt-2">
                      Invitation awaiting confirmation.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidate Roommates Grid */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#7D6E66] mb-3">
            Confirmed Students in Your Room & Floor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateStudents.map((cand) => {
              const alreadyRequested = roommateRequests.some(
                (r) => (r.receiverId === cand.studentId && r.senderId === currentStudent.knustId) ||
                       (r.senderId === cand.studentId && r.receiverId === currentStudent.knustId)
              );

              return (
                <div
                  key={cand.studentId}
                  className={`bg-white rounded-xl border p-5 flex flex-col justify-between hover:shadow-md transition-all ${
                    cand.isSameRoom
                      ? 'border-[#2A2827] ring-1 ring-[#2A2827]/10'
                      : 'border-[#A1927D]/50'
                  }`}
                >
                  <div>
                    {/* Top Row: Tag & Match Score */}
                    <div className="flex items-center justify-between mb-3">
                      {cand.isSameRoom ? (
                        <span className="text-[11px] font-black bg-[#2A2827] text-[#FEFB58] px-2 py-0.5 rounded">
                          Same Room ({cand.roomNumber} · Space #{cand.spaceNumber})
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#7D6E66] bg-[#F4EFE7] px-2 py-0.5 rounded">
                          Room {cand.roomNumber}
                        </span>
                      )}

                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span className="tabular-nums">{cand.matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Student Info (Privacy protected: First name + initial only) */}
                    <h4 className="font-extrabold text-base text-[#2A2827]">
                      {cand.name}
                    </h4>
                    <p className="text-xs text-[#5B514B] font-medium mt-0.5">
                      {cand.program} · {cand.level}
                    </p>

                    {/* Lifestyle Indicators */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[#7D6E66]">
                        <span>Sleep Schedule:</span>
                        <strong className="text-[#2A2827]">{cand.preferences.sleepPreference}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[#7D6E66]">
                        <span>Study Preference:</span>
                        <strong className="text-[#2A2827]">{cand.preferences.studyPreference}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[#7D6E66]">
                        <span>Cleanliness:</span>
                        <strong className="text-[#2A2827]">{cand.preferences.cleanliness}</strong>
                      </div>
                    </div>

                    {/* Interests tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cand.preferences.interests.map((int, i) => (
                        <span key={i} className="text-[10px] bg-[#F4EFE7] text-[#5B514B] px-2 py-0.5 rounded">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <div className="pt-5 mt-4 border-t border-zinc-100">
                    {alreadyRequested ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 bg-zinc-100 text-zinc-500 font-bold text-xs rounded-lg cursor-not-allowed text-center"
                      >
                        Request Active
                      </button>
                    ) : (
                      <button
                        onClick={() => sendRoommateRequest(cand.studentId, cand.name, cand.roomId, cand.roomNumber)}
                        className="w-full py-2.5 px-3 bg-[#5B514B] hover:bg-[#2A2827] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#FEFB58]" />
                        <span>Send Roommate Request</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
