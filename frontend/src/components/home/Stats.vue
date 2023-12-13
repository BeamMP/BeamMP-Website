<template>
  <div class="bg-white dark:bg-slate-800 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.id" class="mx-auto flex max-w-xs flex-col gap-y-4">
          <a :href="stat.link"><dt class="text-base leading-7 text-gray-600 dark:text-white">{{ stat.name }}</dt></a>
          <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-slate-400">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { id: 1, name: 'Players Online', value: '1500', link: '/stats' },
  { id: 2, name: 'Public Servers', value: '1200', link: '/stats' },
  { id: 3, name: 'Users', value: '+760,000', link: 'https://forum.beammp.com' },
  { id: 4, name: 'Discord Members', value: '+190,000', link: 'https://discord.com/servers/beammp-601558901657305098' },
]
</script>