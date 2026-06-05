import { WebSection } from "@/components/sections/kit/web-section";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { ElectrifiedDivider } from "@/components/sections/kit/web-electrified-divider";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";
import { MARQUEE_CLIENTS } from "@/lib/content/website";
import { CREDENTIAL_STRIP } from "@/lib/content/accreditations";

// S1 trust bar — leads with the flagship NGCP 300 MVA / 230 kV credential, then
// the marquee client row and the exclusive Shenda Electric distributor note.
// Glass band; an ElectrifiedDivider separates the credential from the note.

export function HomeClients() {
  return (
    <WebSection>
      <Reveal>
        <div className="glass rounded-(--r-glass) p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-[46ch]">
              <div className="kicker text-jce-green-600">Trusted by</div>
              <h2 className="mt-2 text-[clamp(20px,2.6vw,28px)] leading-[1.15] font-bold tracking-[-0.01em] text-balance text-jce-ink">
                Flagship NGCP credential —{" "}
                <span className="text-jce-green-700">300 MVA / 230 kV</span>{" "}
                substation work on the Cebu–Negros–Panay backbone.
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2 md:max-w-[44%] md:justify-end">
              {MARQUEE_CLIENTS.map((c) => (
                <li
                  key={c}
                  className="rounded-(--r-pill) border border-jce-line bg-white/70 px-3 py-1 font-mono text-ui-12 font-semibold tracking-tight text-jce-ink"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <ElectrifiedDivider className="my-5" />

          {/* Shenda distributorship + a compact §9-SAFE credential strip
              (PCAB Category A · PhilGEPS Platinum · NGCP Accredited · SEC
              Registered). Wraps cleanly at 360/390; light-surface VoltageTags
              carry the amber accent. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ui-13 text-jce-ink-2">
              Exclusive Philippine distributor of{" "}
              <span className="font-semibold text-jce-ink">
                Shenda Electric
              </span>{" "}
              power transformers.
            </p>
            <ul className="flex flex-wrap gap-2">
              {CREDENTIAL_STRIP.map((c) => (
                <li key={c.acronym}>
                  <VoltageTag>
                    {c.acronym} {c.label}
                  </VoltageTag>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </WebSection>
  );
}
