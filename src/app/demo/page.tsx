import Container from "@/components/common/Container";
import { PointsTestControls } from "@/components/common/PointsNotification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMetadata as getMetadata } from "@/config/Meta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...getMetadata("/demo"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return (
    <Container className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">User System Demo</h1>
          <p className="text-muted-foreground">
            Demonstration of the user menu, settings, and real-time points
            system
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Menu Features</CardTitle>
              <CardDescription>
                The user menu in the navbar includes:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>User avatar and profile information</li>
                <li>Real-time points display with animations</li>
                <li>Settings option (opens modal)</li>
                <li>Sign out option (placed below settings as requested)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Points System</CardTitle>
              <CardDescription>
                Test the real-time points updates without page refresh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PointsTestControls />
              <p className="text-muted-foreground mt-4 text-xs">
                Click the buttons above to see real-time points updates in the
                navbar user menu. The points will update instantly without
                requiring a page refresh.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings Modal</CardTitle>
              <CardDescription>
                Comprehensive settings interface with keyboard shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>Profile management with avatar upload</li>
                <li>Notification preferences</li>
                <li>Theme switching integration</li>
                <li>Privacy and security settings</li>
                <li>Auto-save functionality</li>
                <li>
                  <strong>Keyboard shortcuts:</strong> Press{" "}
                  <kbd className="bg-muted rounded border px-1 py-0.5 font-mono text-xs">
                    Enter
                  </kbd>{" "}
                  to save,{" "}
                  <kbd className="bg-muted rounded border px-1 py-0.5 font-mono text-xs">
                    Esc
                  </kbd>{" "}
                  to close
                </li>
              </ul>
              <p className="text-muted-foreground text-xs">
                Click on your avatar in the navbar and select
                &ldquo;Settings&rdquo; to open the modal. Try using Enter key to
                save!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>
                Technical features of the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>
                  <strong>Real-time Updates:</strong> Uses custom events for
                  instant points updates
                </li>
                <li>
                  <strong>Smooth Animations:</strong> 60fps transitions for
                  theme switching and UI interactions
                </li>
                <li>
                  <strong>Accessibility:</strong> Full keyboard navigation and
                  screen reader support
                </li>
                <li>
                  <strong>Responsive Design:</strong> Works seamlessly on all
                  device sizes
                </li>
                <li>
                  <strong>Type Safety:</strong> Full TypeScript implementation
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
