<template>
  <div
    class="max-w-4xl lg:max-w-7xl mx-auto p-4 pl-6 md:pl-10 pr-4 md:pr-8 bg-white rounded-2xl shadow-md border mt-3"
    id="guide"
  >
    <p class="text-xs sm:text-sm md:text-base xl:text-lg text-gray-800 font-medium mb-4">
      Please enter your schedule in the text area below using the following format:
    </p>
    <pre
      class="bg-[#0533452E] text-xs md:text-sm text-black font-normal p-4 rounded-lg whitespace-pre-wrap"
    >
Senin:
Matematika, 10.00-11.40, Ruang 101

Selasa:
Bahasa Inggris, 13.00-14.40, Ruang 501
Pendidikan Agama, 10.00-12.30, online
        </pre
    >
    <ul
      class="mt-4 text-xs sm:text-sm md:text-base xl:text-lg text-gray-800 font-light list-disc list-outside pl-4"
    >
      <li>Day must be written at the beginning of the line, ending with a colon (e.g., Senin:).</li>
      <li>
        Each subject should be written in one line and separated by a comma, like the format:
        <div class="flex justify-center my-1">
          <code
            class="bg-[#0533457D] p-[5px] rounded-sm text-black font-normal text-xs lg:text-sm 2xl:text-base"
          >
            Subject Name, Start-End Time, Description
          </code>
        </div>
      </li>
      <li>Use 24-hour format for time</li>
      <li>
        Make sure the separator between hour and minute is a dot (e.g.,
        <code class="text-sm md:text-base">10.00</code>).
      </li>
      <li>
        Leave an empty line between different days for better readability. (as the example above)
      </li>
    </ul>
  </div>
</template>
