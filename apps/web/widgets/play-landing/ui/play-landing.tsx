'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, CaretRight } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'

export function PlayLanding() {
  return (
    <>
      <MobileHeader />
      <main className="mx-auto max-w-lg px-4 py-8 pb-28 md:max-w-2xl md:py-14 md:pb-14">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-black tracking-tight text-foreground">놀이터</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">투자와 경제를 재미있게 공부해요.</p>
        </div>

        {/* 모바일: 리스트 */}
        <div className="flex flex-col md:hidden">
          <MbtiListItem />
          <QuizListItem />
          <CalcListItem />
        </div>

        {/* 데스크탑: 그리드 */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-3.5">
          <MbtiCard />
          <QuizCard />
          <CalcCard />
        </div>
      </main>
    </>
  )
}

/* ── 모바일 리스트 아이템 ── */

function MbtiListItem() {
  return (
    <Link href="/investment-mbti" className="block">
      <motion.div
        className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-accent/50"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* App icon */}
        <div
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(145deg, #1c0d50, #13082e)' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(167,139,250,0.7) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/mbti/GSFR.png"
              alt="투자성향 MBTI"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">투자 성향 테스트</p>
          <p className="mt-0.5 text-sm text-muted-foreground">내 투자 성향을 발견해 보세요</p>
        </div>

        {/* Chevron */}
        <CaretRight size={18} className="shrink-0 text-muted-foreground/40" />
      </motion.div>
    </Link>
  )
}

function QuizListItem() {
  return (
    <Link href="/economic-quiz" className="block">
      <motion.div
        className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-accent/50"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* App icon */}
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(145deg, #0d2e1e, #071a12)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(52,211,153,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52,211,153,0.6) 1px, transparent 1px)
              `,
              backgroundSize: '18px 18px',
            }}
          />
          <span className="relative text-4xl">📈</span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">경제 용어 퀴즈</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            주식부터 파생상품까지, 내 금융 지식은?
          </p>
        </div>

        {/* Chevron */}
        <CaretRight size={18} className="shrink-0 text-muted-foreground/40" />
      </motion.div>
    </Link>
  )
}

/* ── 데스크탑 포털 카드 ── */

function MbtiCard() {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
      <Link href="/investment-mbti" className="group block">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(160deg, #13082e 0%, #1c0d50 45%, #0e1b3c 100%)',
            height: 'clamp(280px, 52vw, 380px)',
          }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(167,139,250,0.6) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div
            className="absolute -right-6 -top-6 h-36 w-36 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent)' }}
          />
          <div
            className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.4), transparent)' }}
          />

          <div className="absolute inset-0 flex flex-col p-5">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.35)',
                  color: '#c4b5fd',
                }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                16가지 유형
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 -z-10 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent)',
                    transform: 'scale(1.8)',
                  }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src="/images/mbti/GSFR.png"
                    alt="투자성향 MBTI"
                    width={150}
                    height={150}
                    className="object-contain drop-shadow-[0_8px_24px_rgba(124,58,237,0.4)]"
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black leading-tight text-white">
                투자 성향
                <br />
                테스트
              </h2>
              <p
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                나의 투자 스타일과
                <br />
                숨겨진 능력은?
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  3분 · 15문항
                </span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(139,92,246,0.25)',
                    border: '1px solid rgba(139,92,246,0.45)',
                  }}
                >
                  <ArrowUpRight size={14} color="#c4b5fd" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function CalcListItem() {
  return (
    <Link href="/calculator" className="block">
      <motion.div
        className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-accent/50"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* App icon */}
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(145deg, #2d1a00, #1a0e00)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.8) 1px, transparent 1px)`,
              backgroundSize: '14px 14px',
            }}
          />
          <span className="relative text-4xl">💰</span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">복리 계산기</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            복리의 마법으로 미래 자산을 계산해요
          </p>
        </div>

        {/* Chevron */}
        <CaretRight size={18} className="shrink-0 text-muted-foreground/40" />
      </motion.div>
    </Link>
  )
}

function QuizCard() {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
      <Link href="/economic-quiz" className="group block">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(160deg, #071a12 0%, #0d2e1e 45%, #0a1a28 100%)',
            height: 'clamp(280px, 52vw, 380px)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '28px 28px',
            }}
          />
          <div
            className="absolute -right-6 -top-6 h-36 w-36 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent)' }}
          />
          <div
            className="absolute -bottom-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35), transparent)' }}
          />

          <div className="absolute inset-0 flex flex-col p-5">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#6ee7b7',
                }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                6단계 티어
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 -z-10 rounded-full blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(16,185,129,0.35), rgba(245,158,11,0.2), transparent)',
                    transform: 'scale(2.2)',
                  }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                >
                  <div
                    className="flex h-32 w-32 items-center justify-center rounded-2xl"
                    style={{
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.18)',
                    }}
                  >
                    <span className="text-6xl">📈</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black leading-tight text-white">
                경제 용어
                <br />
                퀴즈
              </h2>
              <p
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                나의 금융 지식
                <br />
                레벨을 확인해보세요
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  5분 · 20문항
                </span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(16,185,129,0.2)',
                    border: '1px solid rgba(16,185,129,0.4)',
                  }}
                >
                  <ArrowUpRight size={14} color="#6ee7b7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function CalcCard() {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
      <Link href="/calculator" className="group block">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(160deg, #1a0e00 0%, #2d1900 45%, #1a1200 100%)',
            height: 'clamp(280px, 52vw, 380px)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.7) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          <div
            className="absolute -right-6 -top-6 h-36 w-36 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.45), transparent)' }}
          />
          <div
            className="absolute -bottom-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)' }}
          />

          <div className="absolute inset-0 flex flex-col p-5">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#fcd34d',
                }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                복리의 마법
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 -z-10 rounded-full blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245,158,11,0.4), rgba(251,191,36,0.2), transparent)',
                    transform: 'scale(2.2)',
                  }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                >
                  <div
                    className="flex h-32 w-32 items-center justify-center rounded-2xl"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.18)',
                    }}
                  >
                    <span className="text-6xl">💰</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black leading-tight text-white">
                복리
                <br />
                계산기
              </h2>
              <p
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                미래 자산을
                <br />
                계산해보세요
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  원금 · 적립금 · 이율
                </span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(245,158,11,0.2)',
                    border: '1px solid rgba(245,158,11,0.4)',
                  }}
                >
                  <ArrowUpRight size={14} color="#fcd34d" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
