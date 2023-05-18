import { component$, useSignal } from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';

const stream = server$(async function* () {
  for (let i = 0; i < 10; i++) {
    yield i;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('running', i, this.request.signal.aborted);
  }
});

export default component$(() => {
  const message = useSignal('');
  return (
    <div>
      <button
        onClick$={async () => {
          const values = stream(AbortSignal.timeout(3000));
          try {
            for await (const i of await values) {
              message.value += ` ${i}`;
            }
          } catch (e) {
            console.log('error in for await', e);
          }
        }}
      >
        start
      </button>
      <div>{message.value}</div>
    </div>
  );
});
