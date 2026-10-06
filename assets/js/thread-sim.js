(() => {
  const root = document.getElementById('thread-sim');
  if (!root) return;
  const stages = [8, 12, 16, 20, 24, 32];
  const total = 660;
  const speed = total / 20;
  const panels = [...root.querySelectorAll('.sim__panel')].map((panel) => ({
    panel,
    frames: simulate(panel.dataset.mode === 'platform' ? 200 : Infinity),
    busy: panel.querySelector('.sim__fill--busy'),
    wait: panel.querySelector('.sim__fill--wait'),
    fail: panel.querySelector('.sim__fill--fail'),
    waitValue: panel.querySelector('[data-v="wait"]'),
    failValue: panel.querySelector('[data-v="fail"]'),
    doneValue: panel.querySelector('[data-v="done"]'),
    busyValue: panel.querySelector('[data-v="busy"]'),
    tputValue: panel.querySelector('[data-v="tput"]'),
  }));
  const clock = root.querySelector('[data-sim="clock"]');
  const button = root.querySelector('[data-sim="play"]');
  const seek = root.querySelector('[data-sim="seek"]');
  let elapsed = 0;
  let raf = null;
  let running = false;
  let previous = null;
  let interacted = false;

  function rateAt(t) {
    const stage = Math.min(Math.floor(t / 110), stages.length - 1);
    const progress = Math.min((t - stage * 110) / 20, 1);
    const from = stage ? stages[stage - 1] : stages[0];
    return from + (stages[stage] - from) * progress;
  }
  function simulate(limit) {
    let seed = 42, carry = 0, done = 0, fail = 0;
    const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const queue = [], active = [], completions = [], frames = [];
    for (let t = 0; t <= total; t += 0.5) {
      for (let i = active.length - 1; i >= 0; i--) {
        const request = active[i];
        if (!request.failed && Math.min(t, request.end) - request.at >= 60) {
          request.failed = true; fail++;
        }
        if (request.end <= t) {
          if (!request.failed) done++;
          completions.push(t);
          active.splice(i, 1);
        }
      }
      while (queue.length && t - queue[0].at >= 60) { queue.shift(); fail++; }
      if (t < total) carry += rateAt(t) * 0.5;
      while (carry >= 1) {
        carry--;
        const complaint = random() < 0.7;
        const normal = Math.sqrt(-2 * Math.log(random() || 1e-9)) * Math.cos(2 * Math.PI * random());
        queue.push({at:t, duration:(complaint ? 12.7 : 11.6) * Math.exp((complaint ? 0.32 : 0.25) * normal)});
      }
      while (queue.length && active.length < limit) {
        const request = queue.shift(); request.end = t + request.duration; active.push(request);
      }
      while (completions.length && completions[0] <= t - 30) completions.shift();
      frames.push({busy:active.length, wait:queue.length, fail, done, tput:completions.length / 30});
    }
    return frames;
  }
  function render() {
    clock.textContent = `${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, '0')}`;
    seek.value = elapsed;
    panels.forEach((p) => {
      const f = p.frames[Math.min(Math.floor(elapsed * 2), p.frames.length - 1)];
      p.busy.style.width = `${Math.min(f.busy / 500, 1) * 100}%`;
      p.wait.style.width = `${Math.min(f.wait / 2500, 1) * 100}%`;
      p.fail.style.width = `${Math.min(f.fail / 2500, 1) * 100}%`;
      p.busyValue.textContent = `${f.busy.toLocaleString()}개`;
      p.waitValue.textContent = `${f.wait.toLocaleString()}개`;
      p.failValue.textContent = `${f.fail.toLocaleString()}건`;
      p.doneValue.textContent = f.done.toLocaleString();
      p.tputValue.textContent = f.tput.toFixed(1);
      p.panel.classList.toggle('has-failures', f.fail > 0);
    });
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    previous = null;
    button.textContent = elapsed >= total ? '다시 재생' : '재생';
  }
  function tick(now) {
    if (!running) return;
    if (previous !== null) elapsed = Math.min(total, elapsed + (now - previous) / 1000 * speed);
    previous = now;
    render();
    if (elapsed >= total) stop();
    else raf = requestAnimationFrame(tick);
  }
  function play() {
    if (elapsed >= total) elapsed = 0;
    if (running) return;
    running = true;
    previous = null;
    button.textContent = '일시정지';
    raf = requestAnimationFrame(tick);
  }
  button.addEventListener('click', () => { interacted = true; running ? stop() : play(); });
  root.querySelector('[data-sim="restart"]').addEventListener('click', () => {
    interacted = true; stop(); elapsed = 0; render(); play();
  });
  seek.addEventListener('input', () => { interacted = true; stop(); elapsed = Number(seek.value); render(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  render();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        if (!interacted) play();
      }
    }, { threshold: 0.4 });
    observer.observe(root);
  }
})();
