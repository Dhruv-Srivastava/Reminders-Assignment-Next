"use client";

export default function Radio({ value, name, onChange, checked }) {
  return (
    <label className="p-3 grid place-items-center bg-[#F5F4F8] font-medium rounded-lg relative outline-none cursor-pointer focus-within:bg-violet-200 focus-within:ring focus-within:ring-violet-300 has-[:checked]:bg-[#252B5C] has-[:checked]:text-[#F5F4F8]">
      {value.toUpperCase()}
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        className="absolute -z-10 inset-0 m-auto outline-none"
      />
    </label>
  );
}
