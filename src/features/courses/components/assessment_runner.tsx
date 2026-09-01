"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/tokens";
import CoursesRepository from "../domain/repository/courses_repository";
import {
  AttemptResponse,
  LessonSub,
  QuestionItem,
} from "../domain/data/response/courses_response";

export default function AssessmentRunner({
  sub,
  courseId,
  done,
  onClose,
  onProgress,
}: {
  sub: LessonSub;
  courseId: string;
  done: boolean;
  onClose: () => void;
  onProgress: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">(
    done ? "result" : "intro",
  );

  useEffect(() => {
    setPhase(done ? "result" : "intro");
  }, [sub.id, done]);

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lilac text-primary">
          <HugeiconsIcon icon={Task01Icon} size={32} color="currentColor" />
        </span>
        <h3 className="text-lg font-semibold text-primary">{sub.title}</h3>
        <p className="text-text/60">
          Duration:{" "}
          <span className="font-semibold text-text">
            {sub.duration} min{sub.duration !== 1 ? "s" : ""}
          </span>
        </p>
        <p className="max-w-sm leading-relaxed text-text/55">
          The timer starts as soon as you begin. Your answers are submitted
          automatically when the time runs out.
        </p>
        <Button className="mt-2 w-full max-w-xs" onClick={() => setPhase("quiz")}>
          Start assessment
        </Button>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <Quiz
        sub={sub}
        courseId={courseId}
        onSubmitted={() => {
          onProgress();
          setPhase("result");
        }}
      />
    );
  }

  return <Results sub={sub} courseId={courseId} onClose={onClose} />;
}

function Quiz({
  sub,
  courseId,
  onSubmitted,
}: {
  sub: LessonSub;
  courseId: string;
  onSubmitted: () => void;
}) {
  const repo = new CoursesRepository();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ question: string; choice: number }[]>([]);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const res = await repo.getQuestions(courseId, sub.id);
      if (res.success && res.data) setQuestions(res.data);
      else toast.error(res.message);
      setLoading(false);
    };
    load();
  }, [courseId, sub.id]);

  async function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    const res = await repo.submitAttempt(courseId, sub.id, answers);
    setSubmitting(false);
    if (res.success) onSubmitted();
    else {
      submittedRef.current = false;
      toast.error(res.message);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-text/50">Loading questions...</p>;
  }

  if (questions.length === 0) {
    return (
      <p className="py-16 text-center text-text/55">
        No questions are available for this assessment.
      </p>
    );
  }

  const question = questions[index];
  const selected = answers.find((item) => item.question === question.id)?.choice;
  const isLast = index === questions.length - 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Timer minutes={sub.duration} onTimeout={handleSubmit} />
        <p className="font-medium text-text/60">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border border-sand p-5">
        <p className="text-xs tracking-wide text-text/45 uppercase">
          Question {index + 1} of {questions.length}
        </p>
        <p className="mt-2 font-medium text-primary">{question.question}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const active = selected === optionIndex;
            return (
              <button
                type="button"
                key={option}
                onClick={() =>
                  setAnswers((prev) => [
                    ...prev.filter((item) => item.question !== question.id),
                    { question: question.id, choice: optionIndex },
                  ])
                }
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-3 text-left",
                  active
                    ? "border-secondary bg-secondary/10 text-primary"
                    : "border-sand hover:bg-cream",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Prev
        </Button>
        {isLast ? (
          <Button loading={submitting} onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() =>
              setIndex((value) => Math.min(questions.length - 1, value + 1))
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function Timer({ minutes, onTimeout }: { minutes: number; onTimeout: () => void }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, minutes) * 60);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <span
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold",
        timeLeft <= 30 ? "bg-[#FDF0F0] text-[#991B1B]" : "bg-cream text-text/70",
      )}
    >
      <HugeiconsIcon icon={Clock01Icon} size={16} color="currentColor" />
      {mm}:{ss}
    </span>
  );
}

function Results({
  sub,
  courseId,
  onClose,
}: {
  sub: LessonSub;
  courseId: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<AttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const repo = new CoursesRepository();
      const res = await repo.getAttempt(courseId, sub.id);
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    };
    load();
  }, [courseId, sub.id]);

  if (loading) {
    return <p className="py-16 text-center text-text/50">Loading your result...</p>;
  }

  if (!data?.result) {
    return (
      <div className="space-y-5">
        <p className="rounded-lg bg-cream py-10 text-center text-text/60">
          Your submission was received, but the result is not available yet.
        </p>
        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-cream py-5 text-center">
        <p className="text-xs tracking-wide text-text/50 uppercase">Your score</p>
        <p className="mt-2 text-2xl font-semibold text-primary">
          <span className="text-secondary">{data.result.score}</span>/{data.result.total}{" "}
          — {data.result.percent}%
        </p>
      </div>
      <ol className="space-y-4">
        {data.attempt.map((answer, index) => {
          const question = answer.assessmentQuestion;
          const correct = answer.choice === question.correctOption;
          return (
            <li key={answer.id} className="rounded-lg border border-sand p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-primary">
                  {index + 1}. {question.question}
                </p>
                <HugeiconsIcon
                  icon={correct ? CheckmarkCircle02Icon : Cancel01Icon}
                  size={18}
                  color={correct ? "#38CB89" : "#E84D52"}
                />
              </div>
              <p className="mt-3 text-sm">
                Your answer:{" "}
                <span className={correct ? "text-[#166534]" : "text-[#991B1B]"}>
                  {question.options[answer.choice]}
                </span>
              </p>
              {!correct && (
                <p className="mt-1 text-sm text-[#166534]">
                  Correct answer: {question.options[question.correctOption]}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <Button fullWidth onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
