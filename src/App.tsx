import { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from 'react';
import { 
  Camera, Upload, Sparkles, AlertTriangle, ShieldCheck, Bug, Search, 
  History, BookOpen, RefreshCw, X, ChevronRight, Info, CheckCircle2, 
  Eye, HelpCircle, Zap, ArrowLeft, Volume2
} from 'lucide-react';

export interface InsectRecord {
  id: string;
  commonName: string;
  scientificName: string;
  order: string;
  family?: string;
  dangerLevel: string;
  ecologicalRole: string;
  confidence: number;
  habitat: string;
  diet: string;
  physicalTraits: string[];
  funFacts: string[];
  indoorOutdoorTips: string;
  thumbnail?: string;
  timestamp?: string;
  isSimulated?: boolean;
}

const SAMPLE_INSECTS: InsectRecord[] = [
  {
    id: 'monarch-butterfly',
    commonName: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    order: 'Lepidoptera',
    family: 'Nymphalidae',
    dangerLevel: 'Beneficial',
    ecologicalRole: 'Pollinator',
    confidence: 97,
    habitat: 'Meadows, prairies, roadsides, and suburban gardens with milkweed.',
    diet: 'Nectar from milkweed, goldenrod, aster, and lilac; caterpillars exclusively eat milkweed.',
    physicalTraits: [
      'Vibrant orange wings lined with black borders and white dots',
      'Wingspan of 8.9 to 10.2 cm (3.5 to 4 inches)',
      'Male hindwings feature a noticeable black scent gland spot'
    ],
    funFacts: [
      'Famous for annual multi-generational migration across North America up to 4,000 km.',
      'Caterpillars sequester toxic cardenolides from milkweed, making them distasteful to birds.'
    ],
    indoorOutdoorTips: 'Extremely gentle and beneficial for gardens. If found indoors, gently guide towards an open window or cup with paper to release outside near flowers.',
    thumbnail: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'western-honeybee',
    commonName: 'Western Honeybee',
    scientificName: 'Apis mellifera',
    order: 'Hymenoptera',
    family: 'Apidae',
    dangerLevel: 'Stinging / Beneficial',
    ecologicalRole: 'Key Agricultural Pollinator',
    confidence: 96,
    habitat: 'Agricultural landscapes, orchards, meadows, and commercial hives worldwide.',
    diet: 'Floral nectar (carbohydrates) and pollen (proteins, lipids, minerals).',
    physicalTraits: [
      'Golden-brown to amber striped abdomen with dense thorax fuzz',
      'Corbiculae (pollen baskets) on hind legs',
      'Two pairs of translucent wings linked by tiny hooks (hamuli)'
    ],
    funFacts: [
      'Communicate distance and angle of flowers using complex "waggle dances".',
      'A single hive can contain over 40,000 individual bees during peak summer.'
    ],
    indoorOutdoorTips: 'Not aggressive unless hive is threatened. If indoors, turn off interior lights and open exterior doors/windows—they will head straight towards natural light.',
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'european-praying-mantis',
    commonName: 'Praying Mantis',
    scientificName: 'Mantis religiosa',
    order: 'Mantodea',
    family: 'Mantidae',
    dangerLevel: 'Harmless / Beneficial',
    ecologicalRole: 'Apex Invertebrate Predator',
    confidence: 94,
    habitat: 'Shrubberies, tall grasslands, vegetable plots, and sunny gardens.',
    diet: 'Live insects, caterpillars, grasshoppers, flies, and occasional small spiders.',
    physicalTraits: [
      'Elongated prothorax and triangular head with 180-degree neck rotation',
      'Spiked raptorial front legs adapted for lightning-fast prey capture',
      'Color varies from pale green to dry tan for ambush camouflage'
    ],
    funFacts: [
      'Possess a single auditory organ located centrally on their thorax to detect bat echolocation.',
      'Can strike prey in roughly 50 to 70 milliseconds.'
    ],
    indoorOutdoorTips: 'Harmless to humans and fantastic natural garden biocontrol. If indoors, simply transfer it onto outdoor shrubs using a dry stick or bare hands.',
    thumbnail: 'https://images.unsplash.com/photo-1533651180995-3b8dcd33e834?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'seven-spotted-ladybug',
    commonName: 'Seven-Spotted Ladybug',
    scientificName: 'Coccinella septempunctata',
    order: 'Coleoptera',
    family: 'Coccinellidae',
    dangerLevel: 'Beneficial',
    ecologicalRole: 'Natural Pest Controller',
    confidence: 98,
    habitat: 'Crop fields, gardens, grasslands, and parks infested with aphids.',
    diet: 'Feeds aggressively on aphids, scale insects, whiteflies, and spider mites.',
    physicalTraits: [
      'Convex, domed body with brilliant red elytra wing covers',
      'Exactly seven distinct black spots (three per wing, one shared at suture)',
      'Black pronotum featuring two pale white-yellow lateral spots'
    ],
    funFacts: [
      'A single adult ladybug can consume over 5,000 aphids in its lifetime.',
      'Exudes yellow reflex blood from leg joints with foul-tasting alkaloids to deter predators.'
    ],
    indoorOutdoorTips: 'Very friendly for gardens. Often aggregate in corners of homes during autumn seeking shelter; vacuum gently into a clean sock and release into outdoor brush.',
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'german-cockroach',
    commonName: 'German Cockroach',
    scientificName: 'Blattella germanica',
    order: 'Blattodea',
    family: 'Ectobiidae',
    dangerLevel: 'Urban Pest',
    ecologicalRole: 'Household Scavenger',
    confidence: 92,
    habitat: 'Warm, humid indoor structures, kitchens, food prep areas, and crevices.',
    diet: 'Omnivorous scavenger: starches, sweets, grease, cardboard glue, and food debris.',
    physicalTraits: [
      'Light brown or tan coloration, measuring 1.1 to 1.6 cm in length',
      'Two prominent dark parallel stripes running lengthwise along the pronotum',
      'Wings cover full abdomen though they rarely take sustained flight'
    ],
    funFacts: [
      'Extremely prolific: a single female and her offspring can produce tens of thousands in a year.',
      'Their shedding frass and allergens can trigger asthma and transmit foodborne pathogens.'
    ],
    indoorOutdoorTips: 'Definite sanitation and structural pest. Eliminate food/water leaks, seal baseboard cracks, store foods in airtight bins, and deploy gel bait stations.',
    thumbnail: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'black-widow',
    commonName: 'Southern Black Widow',
    scientificName: 'Latrodectus mactans',
    order: 'Araneae (Arachnid)',
    family: 'Theridiidae',
    dangerLevel: 'Medically Significant Venom',
    ecologicalRole: 'Web Predator',
    confidence: 95,
    habitat: 'Undisturbed woodpiles, dark sheds, crawlspaces, stone walls, and meter boxes.',
    diet: 'Insects entangled in its chaotic, remarkably strong cobwebs.',
    physicalTraits: [
      'Glossy, jet-black bulbous globular abdomen',
      'Distinctive bright red or orange hourglass pattern on the ventral underside',
      'Long, slender legs with comb-like bristles on the fourth pair'
    ],
    funFacts: [
      'Their silk has tensile strength comparable to high-grade alloy steel.',
      'Bites are defensive; only females carry enough latrotoxin to cause severe systemic cramping.'
    ],
    indoorOutdoorTips: 'Exercise high caution. Do not grab barehanded. Use a broom or vacuum hose to clear webs, wear thick leather gloves when handling firewood, and seek prompt medical attention if bitten.',
    thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'guide' | 'history'>('scanner');
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Raw, setBase64Raw] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<InsectRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<string>('All');
  const [selectedGuideInsect, setSelectedGuideInsect] = useState<InsectRecord | null>(null);
  const [scanHistory, setScanHistory] = useState<InsectRecord[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('insectify_history');
      if (saved) {
        setScanHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load history from storage', e);
    }
  }, []);

  const saveToHistory = (item: InsectRecord) => {
    const updated = [item, ...scanHistory.filter((h) => h.id !== item.id)].slice(0, 30);
    setScanHistory(updated);
    try {
      localStorage.setItem('insectify_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('History storage error', e);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setIsCameraActive(false);
      setErrorMsg('Camera access was denied or is unavailable on this device. You can upload a photo instead!');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const raw = dataUrl.split(',')[1];
    setSelectedImage(dataUrl);
    setBase64Raw(raw);
    setMimeType('image/jpeg');
    stopCamera();
    setScanResult(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setSelectedImage(result);
        const raw = result.split(',')[1];
        setBase64Raw(raw);
        setMimeType(file.type || 'image/jpeg');
        setScanResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeInsect = async () => {
    if (!base64Raw) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    const promptText = `You are a world-class entomologist. Analyze this photo to identify the insect, arachnid, or bug. 
Return ONLY a valid, raw JSON object (with NO markdown code fences, NO \`\`\`json) strictly matching this schema:
{
  "commonName": "Primary common name of the insect",
  "scientificName": "Binomial scientific name (Genus species)",
  "order": "Order name (e.g., Coleoptera, Lepidoptera, Odonata, Araneae, etc.)",
  "family": "Family name",
  "confidence": 95,
  "dangerLevel": "Choose one: Harmless, Beneficial, Stinging / Mild, Urban Pest, Agricultural Pest, Medically Significant Venom",
  "ecologicalRole": "Brief description of role (e.g., Pollinator, Decomposer, Apex Predator, Detritivore)",
  "habitat": "Where this species naturally lives",
  "diet": "What it consumes",
  "physicalTraits": ["Trait 1 with details", "Trait 2 with details", "Trait 3 with details"],
  "funFacts": ["Fascinating fact 1", "Fascinating fact 2"],
  "indoorOutdoorTips": "Actionable advice on what someone should do if encountering it indoors or outdoors."
}
If the image does not show any insect, bug, spider, or related arthropod, specify commonName as "Unknown / Not an Arthropod" with confidence 15.`;

    const effectiveKey = customApiKey.trim();

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveKey}`;
      
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Raw
                }
              }
            ]
          }
        ]
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No text response from Gemini vision model.");
      }

      let cleanedJson = rawText.trim();
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanedJson);
      const enrichedResult: InsectRecord = {
        id: 'scan-' + Date.now(),
        timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        thumbnail: selectedImage || undefined,
        ...parsed
      };

      setScanResult(enrichedResult);
      saveToHistory(enrichedResult);

    } catch (err) {
      console.warn("Gemini API call failed or no valid key, using smart mock demonstration:", err);
      const mockCandidate = SAMPLE_INSECTS[Math.floor(Math.random() * SAMPLE_INSECTS.length)];
      const mockResult: InsectRecord = {
        ...mockCandidate,
        id: 'scan-' + Date.now(),
        timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        thumbnail: selectedImage || mockCandidate.thumbnail,
        isSimulated: true
      };
      
      setScanResult(mockResult);
      saveToHistory(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setBase64Raw(null);
    setScanResult(null);
    setErrorMsg(null);
    stopCamera();
  };

  const getDangerBadge = (level = '') => {
    const l = level.toLowerCase();
    if (l.includes('beneficial') || l.includes('harmless')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {level}
        </span>
      );
    }
    if (l.includes('venom') || l.includes('medically')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          {level}
        </span>
      );
    }
    if (l.includes('pest')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Bug className="w-3.5 h-3.5 text-amber-600" />
          {level}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
        <Info className="w-3.5 h-3.5 text-slate-500" />
        {level || 'Unknown'}
      </span>
    );
  };

  const ordersList = ['All', 'Lepidoptera', 'Hymenoptera', 'Coleoptera', 'Mantodea', 'Blattodea', 'Araneae (Arachnid)'];
  const filteredGuide = SAMPLE_INSECTS.filter((insect) => {
    const matchesSearch = insect.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insect.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insect.order.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrder = selectedOrder === 'All' || insect.order === selectedOrder;
    return matchesSearch && matchesOrder;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <canvas ref={canvasRef} className="hidden" />

      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('scanner'); resetScanner(); }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <Bug className="w-6 h-6 transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">Insectify</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                AI Vision
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Instant Arthropod & Insect Identification</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'scanner' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Identify</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'guide' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Field Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Scans</span>
            {scanHistory.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                {scanHistory.length}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="API Settings"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="bg-slate-800 border-b border-emerald-800/40 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span><strong>Gemini Vision API:</strong> Enter a custom Google Gemini API Key or leave empty to use built-in simulator engine.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="password"
              placeholder="Paste AI Studio API Key..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <button
              onClick={() => setShowSettings(false)}
              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-900/60 border-b border-rose-700/50 px-4 py-2.5 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            {!scanResult && (
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Fast AI Naturalist
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Discover Any Bug in Seconds
                </h1>
                <p className="text-sm text-slate-400">
                  Take a live snap or upload an insect picture. Our AI determines taxonomy, ecological impact, bite risks, and natural history.
                </p>
              </div>
            )}

            {isCameraActive && (
              <div className="max-w-xl mx-auto bg-slate-800 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 sm:h-96 object-cover bg-black"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400/70 border-dashed rounded-3xl relative animate-pulse">
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-950/90 text-emerald-300 text-[11px] px-2.5 py-0.5 rounded-full font-medium border border-emerald-500/40">
                      Center the Insect
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 backdrop-blur-sm flex items-center justify-between">
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>
            )}

            {!isCameraActive && !scanResult && (
              <div className="max-w-xl mx-auto space-y-6">
                {selectedImage ? (
                  <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 shadow-xl space-y-4">
                    <div className="relative rounded-xl overflow-hidden max-h-80 bg-black flex items-center justify-center">
                      <img 
                        src={selectedImage} 
                        alt="Insect to identify" 
                        className="w-full h-full object-contain max-h-80 rounded-xl"
                      />
                      <button
                        onClick={resetScanner}
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-rose-900/80 text-white rounded-full transition shadow"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={analyzeInsect}
                        disabled={isAnalyzing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold shadow-lg shadow-emerald-500/20 transition transform active:scale-[0.98]"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin text-white" />
                            <span>Analyzing Anatomy & Taxonomy...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Identify Insect</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetScanner}
                        disabled={isAnalyzing}
                        className="px-4 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-emerald-800/60 hover:border-emerald-500/80 bg-slate-800/40 hover:bg-slate-800/70 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group shadow-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                      <Upload className="w-8 h-8" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                      Upload an Insect Photo
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                      Drag & drop your bug image here, or browse your files (PNG, JPG, WEBP)
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-700/20 transition">
                        Select from Device
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCamera();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold flex items-center gap-2 border border-slate-600 transition"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {scanResult && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={resetScanner}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-emerald-400 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Scan Another Insect</span>
                  </button>
                  <div className="flex items-center gap-2">
                    {scanResult.isSimulated && (
                      <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        Demo Mode (Add API key in Zap icon for live Gemini calls)
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 border-b border-slate-700/60 bg-gradient-to-b from-slate-800 to-slate-800/40">
                    <div className="md:col-span-5 flex flex-col justify-center">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black shadow-inner border border-slate-700">
                        <img
                          src={scanResult.thumbnail || selectedImage || ''}
                          alt={scanResult.commonName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          {getDangerBadge(scanResult.dangerLevel)}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                            Identified Species
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                            {scanResult.confidence}% Confidence
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">
                          {scanResult.commonName}
                        </h2>
                        <p className="text-sm italic text-slate-300 font-serif">
                          {scanResult.scientificName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Order</span>
                          <span className="font-semibold text-slate-200">{scanResult.order}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Family</span>
                          <span className="font-semibold text-slate-200">{scanResult.family || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Ecological Role</span>
                          <span className="font-semibold text-emerald-300">{scanResult.ecologicalRole || 'Insect'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Safety Profile</span>
                          <span className="font-semibold text-slate-200">{scanResult.dangerLevel}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(`${scanResult.commonName}. Scientific name: ${scanResult.scientificName}. Ecological role: ${scanResult.ecologicalRole}`);
                              window.speechSynthesis.speak(utterance);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Pronounce</span>
                        </button>
                        <span className="text-xs text-slate-400">
                          Scanned on {scanResult.timestamp || 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        Key Physical & Anatomical Traits
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {scanResult.physicalTraits?.map((trait: string, idx: number) => (
                          <div key={idx} className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-300 leading-relaxed">{trait}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          Habitat & Distribution
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {scanResult.habitat}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          Diet & Foraging Behaviour
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {scanResult.diet}
                        </p>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <HelpCircle className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-emerald-200">
                          What to Do If You Encounter This Bug
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                        {scanResult.indoorOutdoorTips}
                      </p>
                    </div>

                    {scanResult.funFacts && scanResult.funFacts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Did You Know?
                        </h4>
                        <ul className="space-y-2">
                          {scanResult.funFacts.map((fact: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Insect Field Guide</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Browse common terrestrial arthropods, diagnostic orders, and ecological profiles.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, family, order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {ordersList.map((order) => (
                <button
                  key={order}
                  onClick={() => setSelectedOrder(order)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    selectedOrder === order
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                  }`}
                >
                  {order}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGuide.map((insect) => (
                <div
                  key={insect.id}
                  onClick={() => setSelectedGuideInsect(insect)}
                  className="bg-slate-800/80 rounded-2xl border border-slate-700/70 hover:border-emerald-500/60 overflow-hidden shadow-lg hover:shadow-emerald-900/20 transition group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                      <img
                        src={insect.thumbnail}
                        alt={insect.commonName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        {getDangerBadge(insect.dangerLevel)}
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold bg-slate-900/80 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        Order: {insect.order}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                          {insect.commonName}
                        </h3>
                        <p className="text-xs italic text-slate-400 font-serif">
                          {insect.scientificName}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {insect.habitat}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-700/40 text-xs text-emerald-400 font-medium">
                    <span>View Species Profile</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>

            {filteredGuide.length === 0 && (
              <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700">
                <Bug className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No species found matching your filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Recent Identifications</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  All past scans and observations saved locally on your device.
                </p>
              </div>
              {scanHistory.length > 0 && (
                <button
                  onClick={() => {
                    setScanHistory([]);
                    localStorage.removeItem('insectify_history');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-950/40 transition"
                >
                  Clear History
                </button>
              )}
            </div>

            {scanHistory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setScanResult(item);
                      setActiveTab('scanner');
                    }}
                    className="bg-slate-800 rounded-2xl border border-slate-700 p-3.5 hover:border-emerald-500/50 transition cursor-pointer flex gap-3.5 items-center group"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.commonName}
                      className="w-16 h-16 rounded-xl object-cover bg-black flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition">
                          {item.commonName}
                        </h4>
                      </div>
                      <p className="text-[11px] italic text-slate-400 truncate font-serif">
                        {item.scientificName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{item.confidence}% Match</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/80">
                <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-white mb-1">No Scans Recorded Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Take a photo or upload an image to identify your first specimen!
                </p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Open Scanner
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedGuideInsect && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="relative aspect-[16/9] bg-black">
              <img
                src={selectedGuideInsect.thumbnail}
                alt={selectedGuideInsect.commonName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedGuideInsect(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3">
                {getDangerBadge(selectedGuideInsect.dangerLevel)}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-2xl font-black text-white">{selectedGuideInsect.commonName}</h3>
                <p className="text-sm italic text-slate-400 font-serif">{selectedGuideInsect.scientificName}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-700/70">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Order</span>
                  <span className="font-semibold text-slate-200">{selectedGuideInsect.order}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Family</span>
                  <span className="font-semibold text-slate-200">{selectedGuideInsect.family}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Role</span>
                  <span className="font-semibold text-emerald-300">{selectedGuideInsect.ecologicalRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Risk</span>
                  <span className="font-semibold text-slate-200">{selectedGuideInsect.dangerLevel}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Habitat</h5>
                <p className="text-xs sm:text-sm text-slate-300">{selectedGuideInsect.habitat}</p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Diet</h5>
                <p className="text-xs sm:text-sm text-slate-300">{selectedGuideInsect.diet}</p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Key Traits</h5>
                <ul className="space-y-1">
                  {selectedGuideInsect.physicalTraits.map((trait: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                <h5 className="text-xs font-bold text-amber-300 mb-1">Encounter Guidelines</h5>
                <p className="text-xs text-slate-300">{selectedGuideInsect.indoorOutdoorTips}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedGuideInsect(null)}
                  className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <p>Insectify AI • Powered by Gemini Vision & Biological Taxonomy Intelligence • For outdoor discovery & education</p>
      </footer>
    </div>
  );
}
