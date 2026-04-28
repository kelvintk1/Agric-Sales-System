import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';
import farmHero from '@/assets/hero.png';
import dataEntryImg from '@/assets/data-entry-ill.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fullText = 'Data Entry\nMade\nConvenient👍';

  useEffect(() => {
    let i = 0;
    let phase = 'typing';
    let pauseCount = 0;

    const timer = setInterval(() => {
      if (phase === 'typing') {
        setDisplayedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          phase = 'pausing';
          pauseCount = 0;
        }
      } else if (phase === 'pausing') {
        pauseCount++;
        if (pauseCount > 15) phase = 'deleting';
      } else {
        i--;
        setDisplayedText(fullText.slice(0, i));
        if (i <= 0) phase = 'typing';
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;

      // Block if role doesn't match the selected login type
      if (isAdmin && data.role !== 'admin') {
        setError('Invalid credentials.');
        return;
      }
      if (!isAdmin && data.role !== 'salesperson') {
        setError('Invalid credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      login(data);

      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/sales/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 relative flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <img src={farmHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" />
        </div>

        <div className="relative z-10 w-full max-w-sm px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground font-medium text-sm">AgriSales</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-primary-foreground">
              {isAdmin ? 'Admin Login' : 'Salesperson Login'}
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="text-primary-foreground/90 text-sm">Email:</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-primary-foreground/15 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:ring-accent"
                placeholder="Enter email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label className="text-primary-foreground/90 text-sm">Password:</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 bg-primary-foreground/15 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:ring-accent"
                placeholder="Enter password"
                required
              />
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2 px-3"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-semibold h-11 text-base rounded-full shadow-lg disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-primary-foreground/70"
            >
              {isAdmin ? 'Are you a Salesperson?' : 'Are you an Admin?'}{' '}
              <button
                type="button"
                onClick={() => { setIsAdmin(!isAdmin); setError(''); }}
                className="text-accent font-semibold hover:underline"
              >
                Login here
              </button>
            </motion.p>
          </form>
        </div>
      </motion.div>

      {/* Right - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex w-1/2 gradient-login flex-col items-center justify-center p-12"
      >
        <div className="w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-display font-bold text-primary-foreground mb-6 leading-tight text-left h-16"
          >
            {displayedText.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
            <span
              className={`inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle transition-opacity ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </motion.h2>
        </div>
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <img
              src={dataEntryImg}
              alt="Data entry illustration"
              className="w-full max-w-sm mx-auto mt-6"
              width={800}
              height={800}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;