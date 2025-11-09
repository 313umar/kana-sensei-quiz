-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('hiragana', 'katakana', 'vocabulary')),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  category TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  share_id TEXT UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for questions
CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
  ON public.questions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quiz_results
CREATE POLICY "Anyone can view quiz results"
  ON public.quiz_results FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert quiz results"
  ON public.quiz_results FOR INSERT
  WITH CHECK (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample questions
INSERT INTO public.questions (category, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
  ('hiragana', 'What is the reading of あ?', 'a', 'i', 'u', 'e', 'A'),
  ('hiragana', 'What is the reading of か?', 'ka', 'sa', 'ta', 'na', 'A'),
  ('hiragana', 'What is the reading of さ?', 'ka', 'sa', 'ta', 'na', 'B'),
  ('hiragana', 'What is the reading of た?', 'ka', 'sa', 'ta', 'na', 'C'),
  ('hiragana', 'What is the reading of な?', 'ka', 'sa', 'ta', 'na', 'D'),
  ('katakana', 'What is the reading of ア?', 'a', 'i', 'u', 'e', 'A'),
  ('katakana', 'What is the reading of カ?', 'ka', 'sa', 'ta', 'na', 'A'),
  ('katakana', 'What is the reading of サ?', 'ka', 'sa', 'ta', 'na', 'B'),
  ('katakana', 'What is the reading of タ?', 'ka', 'sa', 'ta', 'na', 'C'),
  ('katakana', 'What is the reading of ナ?', 'ka', 'sa', 'ta', 'na', 'D'),
  ('vocabulary', 'What does こんにちは mean?', 'Hello', 'Goodbye', 'Thank you', 'Sorry', 'A'),
  ('vocabulary', 'What does ありがとう mean?', 'Hello', 'Goodbye', 'Thank you', 'Sorry', 'C'),
  ('vocabulary', 'What does さようなら mean?', 'Hello', 'Goodbye', 'Thank you', 'Sorry', 'B'),
  ('vocabulary', 'What does すみません mean?', 'Hello', 'Goodbye', 'Thank you', 'Excuse me', 'D'),
  ('vocabulary', 'What does おはよう mean?', 'Good morning', 'Good night', 'Good afternoon', 'Good evening', 'A');